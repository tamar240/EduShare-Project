
# הוספה של העלאה לAWS דרך הAPI
from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os, tempfile, requests, fitz, docx, pytesseract, openai
from PIL import Image
from openai import OpenAI, OpenAIError
from fpdf import FPDF
from fpdf import __version__
import fpdf


print(f"גרסת fpdf2 בתוך הקוד: {fpdf.__version__}")

# === הגדרות בסיסיות ===
app = FastAPI()

# === אתחול OpenAI Client ===
try:
    openai_api_key = "********************"
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")
    client = OpenAI(api_key=openai_api_key)
except ValueError as e:
    print(f"Error initializing OpenAI client: {e}")
    raise RuntimeError("Failed to initialize OpenAI client") from e
except OpenAIError as e:
    print(f"Error with OpenAI API: {e}")
    raise RuntimeError("Failed to initialize OpenAI client due to OpenAI error") from e

# === הגדרות API URLs ===
UPLOAD_API = "https://localhost:7249/api/upload/presigned-url"
VIEW_API = "https://localhost:7249/api/upload/presigned-url/view"

# === דגם קלט ===
class FileUrl(BaseModel):
    file_url: str
    lesson_id: str  # שדה חדש

@app.get("/")
def read_root():
    return {"message": "EduShare AI Service is running!"}

# === שליפת טקסט מהקובץ ===
def extract_text(file_path):
    ext = file_path.lower()
    if ext.endswith(".pdf"):
        try:
            doc = fitz.open(file_path)
            return "\n".join(page.get_text() for page in doc)
        except Exception:
            return ""
    elif ext.endswith(".docx"):
        try:
            doc = docx.Document(file_path)
            return "\n".join(p.text for p in doc.paragraphs)
        except Exception:
            return ""
    elif ext.endswith((".png", ".jpg", ".jpeg")):
        try:
            return pytesseract.image_to_string(Image.open(file_path))
        except Exception:
            return ""
    else:
        return ""

# === יצירת מערך שיעור ע"י OpenAI ===
def generate_lesson_plan(text):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "אתה מסכם שיעורים"},
                {"role": "user", "content": f"""
הטקסט הבא הוא סיכום שיעור. תנתח אותו ותחזיר לי תבנית מסודרת של מערך שיעור.
התבנית צריכה לכלול:
- נושא השיעור
- מטרות
- חומרים נדרשים
- שלבי שיעור (בתיאור קצר)
- שאלות לדיון
- משימת סיכום

טקסט:

{text}
"""}
            ],
            temperature=0.5
        )
        print(response.choices[0].message.content)
        return response.choices[0].message.content
    except Exception:
        return ""


def reverse_rtl_text(text: str) -> str:
    reversed_lines = []
    for line in text.split('\n'):
        reversed_line = ''.join(reversed(line))
        reversed_lines.append(reversed_line)
    return '\n'.join(reversed_lines)

def save_to_pdf(content: str, output_path: str):
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.add_font('Alef', '', 'fonts/Alef-Regular.ttf', uni=True)
        pdf.set_font("Alef", size=12)
        pdf.set_right_margin(10)  # תוספת מרווח מימין
        pdf.set_left_margin(10)   # תוספת מרווח משמאל
        pdf.set_auto_page_break(auto=True, margin=15)

        # הוספת טקסט מימין לשמאל
        for line in content.split('\n'):
            pdf.cell(200, 10, txt=line, ln=1, align='L')  # align='R' - מימין לשמאל

        pdf.output(output_path, "F")
    except Exception as e:
        print(f"save_to_pdf: Error saving to PDF: {e}")

# === בקשת כתובת להעלאה ===
def get_presigned_upload_url(file_name: str, content_type: str, token: str) -> dict:
    headers = {"Authorization": f"Bearer {token}"}
    params = {"fileName": file_name, "contentType": content_type}
    response = requests.get(UPLOAD_API, headers=headers, params=params, verify=False)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get presigned upload URL")
    return response.json()

# === העלאת קובץ ל-S3 ===
def upload_file_to_s3(upload_url: str, file_path: str, content_type: str):
    with open(file_path, "rb") as f:
        response = requests.put(upload_url, data=f, headers={"Content-Type": content_type})
    if response.status_code not in [200, 201]:
        raise HTTPException(status_code=500, detail="Failed to upload file to S3")

# === בקשת כתובת לצפייה ===
def get_presigned_view_url(file_key: str, token: str) -> str:
    headers = {"Authorization": f"Bearer {token}"}
    params = {"filePath": file_key}
    response = requests.get(VIEW_API, headers=headers, params=params, verify=False)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to get presigned view URL")
    return response.json()["url"]

# === נקודת קצה ראשית לעיבוד קובץ ===
@app.post("/process-file")
async def process_file(body: FileUrl, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = authorization.replace("Bearer ", "")
    file_url = body.file_url
    lesson_id= body.lesson_id

    try:
        # הורדת הקובץ
        response = requests.get(file_url)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to download file")

        ext = file_url.split('.')[-1].split('?')[0]

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp:
            temp.write(response.content)
            temp.flush()
            temp_path = temp.name

        # שליפת טקסט
        extracted_text = extract_text(temp_path)

        # יצירת מערך שיעור
        # lesson_plan = generate_lesson_plan(extracted_text)

        # # שמירה ל-PDF
        # pdf_path = temp_path + ".pdf"
        # save_to_pdf(lesson_plan, pdf_path)

        lesson_plan = generate_lesson_plan(extracted_text)
        lesson_plan = reverse_rtl_text(lesson_plan)  # הפוך את המלל לפני שמירתו
        pdf_path = temp_path + ".pdf"
        save_to_pdf(lesson_plan, pdf_path)


         # חשוב לשים את שם השיעור כאן במקום המתאים
        tmp_file_name = f"lessonId_{lesson_id}_summary.pdf"
        # tmp_file_name = os.path.basename(pdf_path)

        # בקשת URL חתום להעלאה
        presigned_data = get_presigned_upload_url(tmp_file_name, "application/pdf", token)
        upload_url = presigned_data["url"]

        # שליפת fileKey מתוך ה-URL
        file_key = upload_url.split(".com/")[1].split("?")[0]

        # העלאת הקובץ
        upload_file_to_s3(upload_url, pdf_path, "application/pdf")

        # בקשת URL לצפייה
        view_url = get_presigned_view_url(file_key, token)

        # ניקיון
        os.remove(temp_path)
        os.remove(pdf_path)

       
        # החזרת פרטים לשמירה ב-DB
        return JSONResponse(content={
            "file_name": f"lessonId_{lesson_id}_summary.pdf",
            "fileKey": file_key,
            "viewUrl": view_url
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

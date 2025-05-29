
# # הוספה של העלאה לAWS דרך הAPI
# from dotenv import load_dotenv
# from fastapi import FastAPI, HTTPException, Header, Request
# from fastapi.responses import JSONResponse
# from pydantic import BaseModel
# import os, tempfile, requests, fitz, docx, pytesseract, openai
# from PIL import Image
# from openai import OpenAI, OpenAIError
# from fpdf import FPDF
# from fpdf import __version__
# import fpdf
# from fastapi.middleware.cors import CORSMiddleware


# print(f"גרסת fpdf2 בתוך הקוד: {fpdf.__version__}")

# # === הגדרות בסיסיות ===
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5228", "https://edushare-api.onrender.com"],  # תחליף למה שצריך
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# load_dotenv()
# api_key = os.getenv('OPENAI_API_KEY')
# print(f"API KEY LOADED: {api_key}")  # הדפסה לבדיקת טעינה

# #load_dotenv()
# # === אתחול OpenAI Client ===
# try:
#     if not api_key:
#         raise ValueError("OPENAI_API_KEY environment variable not set.")
#     client = OpenAI(api_key=api_key)
# except ValueError as e:
#     print(f"Error initializing OpenAI client: {e}")
#     raise RuntimeError("Failed to initialize OpenAI client") from e
# except OpenAIError as e:
#     print(f"Error with OpenAI API: {e}")
#     raise RuntimeError("Failed to initialize OpenAI client due to OpenAI error") from e

# # === הגדרות API URLs ===
# UPLOAD_API = "https://edushare-api.onrender.com/api/upload/presigned-url"
# VIEW_API = "https://edushare-api.onrender.com/api/upload/presigned-url/view"

# # === דגם קלט ===
# class FileUrl(BaseModel):
#     file_url: str
#     lesson_id: str  # שדה חדש

    

# @app.get("/")
# def read_root():
#     return {"message": "EduShare AI Service is running!"}

# # === שליפת טקסט מהקובץ ===
# def extract_text(file_path):
#     ext = file_path.lower()
#     if ext.endswith(".pdf"):
#         try:
#             doc = fitz.open(file_path)
#             return "\n".join(page.get_text() for page in doc)
#         except Exception:
#             return ""
#     elif ext.endswith(".docx"):
#         try:
#             doc = docx.Document(file_path)
#             return "\n".join(p.text for p in doc.paragraphs)
#         except Exception:
#             return ""
#     elif ext.endswith((".png", ".jpg", ".jpeg")):
#         try:
#             return pytesseract.image_to_string(Image.open(file_path))
#         except Exception:
#             return ""
#     else:
#         return ""

# # === יצירת מערך שיעור ע"י OpenAI ===
# def generate_lesson_plan(text):
#     try:
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "אתה מסכם שיעורים"},
#                 {"role": "user", "content": f"""
# הטקסט הבא הוא סיכום שיעור. תנתח אותו ותחזיר לי תבנית מסודרת של מערך שיעור.
# התבנית צריכה לכלול:
# - נושא השיעור
# - מטרות
# - חומרים נדרשים
# - שלבי שיעור (בתיאור קצר)
# - שאלות לדיון
# - משימת סיכום

# טקסט:

# {text}
# """}
#             ],
#             temperature=0.5
#         )
#         print(response.choices[0].message.content)
#         return response.choices[0].message.content
#     except Exception:
#         return ""


# def reverse_rtl_text(text: str) -> str:
#     reversed_lines = []
#     for line in text.split('\n'):
#         reversed_line = ''.join(reversed(line))
#         reversed_lines.append(reversed_line)
#     return '\n'.join(reversed_lines)

# def save_to_pdf(content: str, output_path: str):
#     try:
#         pdf = FPDF()
#         pdf.add_page()
#         pdf.add_font('Alef', '', 'fonts/Alef-Regular.ttf', uni=True)
#         pdf.set_font("Alef", size=12)
#         pdf.set_right_margin(10)  # תוספת מרווח מימין
#         pdf.set_left_margin(10)   # תוספת מרווח משמאל
#         pdf.set_auto_page_break(auto=True, margin=15)

#         # הוספת טקסט מימין לשמאל
#         for line in content.split('\n'):
#             pdf.cell(200, 10, txt=line, ln=1, align='L')  # align='R' - מימין לשמאל

#         pdf.output(output_path, "F")
#     except Exception as e:
#         print(f"save_to_pdf: Error saving to PDF: {e}")

# # === בקשת כתובת להעלאה ===
# def get_presigned_upload_url(file_name: str, content_type: str, token: str) -> dict:
#     headers = {"Authorization": f"Bearer {token}"}
#     params = {"fileName": file_name, "contentType": content_type}
#     response = requests.get(UPLOAD_API, headers=headers, params=params, verify=False)
#     if response.status_code != 200:
#         raise HTTPException(status_code=500, detail="Failed to get presigned upload URL")
#     return response.json()

# # === העלאת קובץ ל-S3 ===
# def upload_file_to_s3(upload_url: str, file_path: str, content_type: str):
#     with open(file_path, "rb") as f:
#         response = requests.put(upload_url, data=f, headers={"Content-Type": content_type})
#     if response.status_code not in [200, 201]:
#         raise HTTPException(status_code=500, detail="Failed to upload file to S3")

# # === בקשת כתובת לצפייה ===
# def get_presigned_view_url(file_key: str, token: str) -> str:
#     headers = {"Authorization": f"Bearer {token}"}
#     params = {"filePath": file_key}
#     response = requests.get(VIEW_API, headers=headers, params=params, verify=False)
#     if response.status_code != 200:
#         raise HTTPException(status_code=500, detail="Failed to get presigned view URL")
#     return response.json()["url"]

# def remove_undefined_suffix(text: str) -> str:
#     if text.endswith("undefined"):
#         return text[:-len("undefined")]
#     return text

# # === נקודת קצה ראשית לעיבוד קובץ ===
# @app.post("/process-file")
# async def process_file(body: FileUrl, authorization: str = Header(None)):
#     # print("xxdfgh",body.file_url)
#     # body.file_url = remove_undefined_suffix(body.file_url)
#     # print("after",body.file_url)

#     if not authorization:
#         raise HTTPException(status_code=401, detail="Authorization header missing")
#     print("iuyh")
#     token = authorization.replace("Bearer ", "")
#     file_url = body.file_url

#     lesson_id= body.lesson_id


#     try:
#         # הורדת הקובץ
#         print("file url bb", file_url)
#         response = requests.get(file_url)
#         print("file url  aa", file_url)
#         if response.status_code != 200:
#             print("response status code", response.status_code)
#             raise HTTPException(status_code=400, detail="Failed to download file")

#         ext = file_url.split('.')[-1].split('?')[0]
#         print("ext", ext)   
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp:
#             temp.write(response.content)
#             temp.flush()
#             temp_path = temp.name

#         # שליפת טקסט
#         extracted_text = extract_text(temp_path)

#         # יצירת מערך שיעור
#         # lesson_plan = generate_lesson_plan(extracted_text)

#         # # שמירה ל-PDF
#         # pdf_path = temp_path + ".pdf"
#         # save_to_pdf(lesson_plan, pdf_path)

#         lesson_plan = generate_lesson_plan(extracted_text)
#         lesson_plan = reverse_rtl_text(lesson_plan)  # הפוך את המלל לפני שמירתו
#         pdf_path = temp_path + ".pdf"
#         save_to_pdf(lesson_plan, pdf_path)


#          # חשוב לשים את שם השיעור כאן במקום המתאים
#         tmp_file_name = f"lessonId_{lesson_id}_summary.pdf"
#         # tmp_file_name = os.path.basename(pdf_path)

#         # בקשת URL חתום להעלאה
#         presigned_data = get_presigned_upload_url(tmp_file_name, "application/pdf", token)
#         upload_url = presigned_data["url"]

#         # שליפת fileKey מתוך ה-URL
#         file_key = upload_url.split(".com/")[1].split("?")[0]

#         # העלאת הקובץ
#         upload_file_to_s3(upload_url, pdf_path, "application/pdf")

#         # בקשת URL לצפייה
#         view_url = get_presigned_view_url(file_key, token)

  

#         print(f"file  url : {file_url}")
#         print(f"file  view url : {view_url}")
#         print(f"file  key : {file_key}")


#         pdf_size = os.path.getsize(pdf_path)
#         os.remove(temp_path)
#         os.remove(pdf_path)

       
#         # החזרת פרטים לשמירה ב-DB
#         return JSONResponse(content={
#             "file_name": f"lessonId_{lesson_id}_summary.pdf",
#             "fileKey": file_key,
#             "viewUrl": view_url,
#             "size": pdf_size,
#         })
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
# הוספה של העלאה לAWS דרך הAPI
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os, tempfile, requests, fitz, docx, pytesseract, openai
from PIL import Image
from openai import OpenAI, OpenAIError
from fpdf import FPDF
from fpdf import __version__
import fpdf
from fastapi.middleware.cors import CORSMiddleware
import re

print(f"גרסת fpdf2 בתוך הקוד: {fpdf.__version__}")

# === הגדרות בסיסיות ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5228", "https://edushare-api.onrender.com"],  # תחליף למה שצריך
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
print(f"API KEY LOADED: {api_key}")  # הדפסה לבדיקת טעינה

#load_dotenv()
# === אתחול OpenAI Client ===
try:
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")
    client = OpenAI(api_key=api_key)
except ValueError as e:
    print(f"Error initializing OpenAI client: {e}")
    raise RuntimeError("Failed to initialize OpenAI client") from e
except OpenAIError as e:
    print(f"Error with OpenAI API: {e}")
    raise RuntimeError("Failed to initialize OpenAI client due to OpenAI error") from e

# === הגדרות API URLs ===
UPLOAD_API = "https://edushare-api.onrender.com/api/upload/presigned-url"
VIEW_API = "https://edushare-api.onrender.com/api/upload/presigned-url/view"

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

def is_hebrew_text(text):
    """בודק אם הטקסט מכיל עברית"""
    hebrew_pattern = re.compile(r'[\u0590-\u05FF]')
    return bool(hebrew_pattern.search(text))

def save_to_pdf(content: str, output_path: str):
    try:
        pdf = FPDF()
        pdf.add_page()
        
        # הוספת פונט עברי
        pdf.add_font('Alef', '', 'fonts/Alef-Regular.ttf', uni=True)
        
        # ניסיון להוסיף פונט מודגש (אם קיים)
        bold_font_available = False
        try:
            pdf.add_font('Alef', 'B', 'fonts/Alef-Bold.ttf', uni=True)
            bold_font_available = True
        except:
            print("הערה: פונט Alef-Bold לא נמצא, נשתמש בפונט רגיל גם לכותרות")
            bold_font_available = False
        
        # הגדרת מרווחים
        pdf.set_right_margin(15)
        pdf.set_left_margin(15)
        pdf.set_top_margin(20)
        pdf.set_auto_page_break(auto=True, margin=20)
        
        # עיבוד השורות
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                pdf.ln(5)  # רווח קטן בין פסקאות
                continue
            
            # זיהוי כותרות ראשיות (מתחילות ב-###)
            if line.startswith('###'):
                pdf.ln(10)  # רווח לפני כותרת ראשית
                if bold_font_available:
                    pdf.set_font("Alef", 'B', 16)
                else:
                    pdf.set_font("Alef", '', 16)  # פונט רגיל בגודל גדול יותר
                title_text = line.replace('###', '').strip()
                
                # הוספת רקע צבעוני לכותרת
                pdf.set_fill_color(41, 128, 185)  # כחול
                pdf.set_text_color(255, 255, 255)  # לבן
                
                # חישוב רוחב הטקסט והוספת padding
                text_width = pdf.get_string_width(title_text) + 10
                x_position = pdf.w - pdf.r_margin - text_width
                
                pdf.set_xy(x_position, pdf.get_y())
                pdf.cell(text_width, 12, title_text, 0, 1, 'C', True)
                
                pdf.set_text_color(0, 0, 0)  # חזרה לשחור
                pdf.ln(5)
                
            # זיהוי כותרות משניות (מתחילות ב-####)
            elif line.startswith('####'):
                pdf.ln(8)
                if bold_font_available:
                    pdf.set_font("Alef", 'B', 14)
                else:
                    pdf.set_font("Alef", '', 14)  # פונט רגיל בגודל גדול יותר
                subtitle_text = line.replace('####', '').strip()
                
                # רקע אפור בהיר לכותרת משנית
                pdf.set_fill_color(236, 240, 241)  # אפור בהיר
                pdf.set_text_color(52, 73, 94)  # כחול כהה
                
                text_width = pdf.get_string_width(subtitle_text) + 8
                x_position = pdf.w - pdf.r_margin - text_width
                
                pdf.set_xy(x_position, pdf.get_y())
                pdf.cell(text_width, 10, subtitle_text, 0, 1, 'C', True)
                
                pdf.set_text_color(0, 0, 0)  # חזרה לשחור
                pdf.ln(3)
                
            # זיהוי רשימות מספרות
            elif re.match(r'^\d+\.', line):
                pdf.set_font("Alef", '', 12)
                pdf.set_text_color(44, 62, 80)  # כחול כהה
                
                # הוספת סימן bullet טקסטואלי
                bullet_symbol = "●"  # נקודה שחורה
                bullet_x = pdf.w - pdf.r_margin - pdf.get_string_width(bullet_symbol) - 5
                pdf.set_xy(bullet_x, pdf.get_y())
                pdf.set_text_color(52, 152, 219)  # כחול
                pdf.cell(pdf.get_string_width(bullet_symbol), 8, bullet_symbol, 0, 0, 'C')
                pdf.set_text_color(44, 62, 80)  # חזרה לכחול כהה
                
                # הוספת הטקסט
                text_width = pdf.w - pdf.l_margin - pdf.r_margin - 20
                pdf.set_xy(pdf.w - pdf.r_margin - text_width, pdf.get_y())
                
                # פיצול טקסט ארוך למספר שורות
                words = line.split()
                current_line = ""
                
                for word in words:
                    test_line = word + " " + current_line if current_line else word
                    if pdf.get_string_width(test_line) <= text_width - 20:
                        current_line = test_line
                    else:
                        if current_line:
                            pdf.cell(text_width, 8, current_line, 0, 1, 'R')
                            current_line = word
                        else:
                            pdf.cell(text_width, 8, word, 0, 1, 'R')
                            current_line = ""
                
                if current_line:
                    pdf.cell(text_width, 8, current_line, 0, 1, 'R')
                
                pdf.set_text_color(0, 0, 0)  # חזרה לשחור
                pdf.ln(2)
                
            # טקסט רגיל
            else:
                pdf.set_font("Alef", '', 12)
                text_width = pdf.w - pdf.l_margin - pdf.r_margin
                
                # פיצול טקסט ארוך למספר שורות
                words = line.split()
                current_line = ""
                
                for word in words:
                    test_line = word + " " + current_line if current_line else word
                    if pdf.get_string_width(test_line) <= text_width - 10:
                        current_line = test_line
                    else:
                        if current_line:
                            x_pos = pdf.w - pdf.r_margin - pdf.get_string_width(current_line)
                            pdf.set_x(x_pos)
                            pdf.cell(0, 8, current_line, 0, 1, 'R')
                            current_line = word
                        else:
                            x_pos = pdf.w - pdf.r_margin - pdf.get_string_width(word)
                            pdf.set_x(x_pos)
                            pdf.cell(0, 8, word, 0, 1, 'R')
                            current_line = ""
                
                if current_line:
                    x_pos = pdf.w - pdf.r_margin - pdf.get_string_width(current_line)
                    pdf.set_x(x_pos)
                    pdf.cell(0, 8, current_line, 0, 1, 'R')
                
                pdf.ln(3)
        
        # הוספת footer
        pdf.ln(10)
        pdf.set_font("Alef", '', 10)
        pdf.set_text_color(127, 140, 141)  # אפור
        footer_text = "נוצר באמצעות מערכת EduShare AI"
        footer_width = pdf.get_string_width(footer_text)
        pdf.set_xy((pdf.w - footer_width) / 2, pdf.h - 30)
        pdf.cell(footer_width, 10, footer_text, 0, 0, 'C')
        
        pdf.output(output_path, "F")
        print(f"PDF נשמר בהצלחה: {output_path}")
        
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

def remove_undefined_suffix(text: str) -> str:
    if text.endswith("undefined"):
        return text[:-len("undefined")]
    return text

# === נקודת קצה ראשית לעיבוד קובץ ===
@app.post("/process-file")
async def process_file(body: FileUrl, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    print("iuyh")
    token = authorization.replace("Bearer ", "")
    file_url = body.file_url

    lesson_id= body.lesson_id

    try:
        # הורדת הקובץ
        print("file url bb", file_url)
        response = requests.get(file_url)
        print("file url  aa", file_url)
        if response.status_code != 200:
            print("response status code", response.status_code)
            raise HTTPException(status_code=400, detail="Failed to download file")

        ext = file_url.split('.')[-1].split('?')[0]
        print("ext", ext)   
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp:
            temp.write(response.content)
            temp.flush()
            temp_path = temp.name

        # שליפת טקסט
        extracted_text = extract_text(temp_path)

        # יצירת מערך שיעור (בלי הפיכת כיוון - נעשה בפונקציית השמירה)
        lesson_plan = generate_lesson_plan(extracted_text)
        
        # שמירה ל-PDF (הפונקציה החדשה כבר מטפלת בכיוון הנכון)
        pdf_path = temp_path + ".pdf"
        save_to_pdf(lesson_plan, pdf_path)

         # חשוב לשים את שם השיעור כאן במקום המתאים
        tmp_file_name = f"lessonId_{lesson_id}_summary.pdf"

        # בקשת URL חתום להעלאה
        presigned_data = get_presigned_upload_url(tmp_file_name, "application/pdf", token)
        upload_url = presigned_data["url"]

        # שליפת fileKey מתוך ה-URL
        file_key = upload_url.split(".com/")[1].split("?")[0]

        # העלאת הקובץ
        upload_file_to_s3(upload_url, pdf_path, "application/pdf")

        # בקשת URL לצפייה
        view_url = get_presigned_view_url(file_key, token)

        print(f"file  url : {file_url}")
        print(f"file  view url : {view_url}")
        print(f"file  key : {file_key}")

        pdf_size = os.path.getsize(pdf_path)
        os.remove(temp_path)
        os.remove(pdf_path)

       
        # החזרת פרטים לשמירה ב-DB
        return JSONResponse(content={
            "file_name": f"lessonId_{lesson_id}_summary.pdf",
            "fileKey": file_key,
            "viewUrl": view_url,
            "size": pdf_size,
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
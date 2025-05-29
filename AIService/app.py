
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
    allow_origins=["http://localhost:5228", "https://edushare-api.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
print(f"API KEY LOADED: {api_key}")

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
    lesson_id: str

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

# === הפיכת כיוון טקסט עברי - הפונקציה המושלמת! ===
def reverse_rtl_text(text: str) -> str:
    """הופכת את כיוון הטקסט העברי כך שיוצג נכון ב-PDF"""
    reversed_lines = []
    for line in text.split('\n'):
        # הפיכת כל שורה בנפרד
        reversed_line = ''.join(reversed(line))
        reversed_lines.append(reversed_line)
    return '\n'.join(reversed_lines)

# === יצירת PDF מעוצב ומושלם עם תיקון כותרת ופוטר ===
def save_to_pdf(content: str, output_path: str):
    try:
        pdf = FPDF()
        pdf.add_page()
        
        # הגדרת פונט עברי
        pdf.add_font('Alef', '', 'fonts/Alef-Regular.ttf', uni=True)
        
        # ניסיון להוסיף פונט מודגש
        bold_font_available = False
        try:
            pdf.add_font('Alef', 'B', 'fonts/Alef-Bold.ttf', uni=True)
            bold_font_available = True
        except:
            print("הערה: פונט Alef-Bold לא נמצא, נשתמש בפונט רגיל")
            bold_font_available = False
        
        # הגדרת מרווחים יפים
        pdf.set_right_margin(20)
        pdf.set_left_margin(20)
        pdf.set_top_margin(25)
        pdf.set_auto_page_break(auto=True, margin=25)
        
        # הוספת כותרת ראשית מעוצבת - עם תיקון הכיוון!
        pdf.set_fill_color(41, 128, 185)  # כחול יפה
        pdf.rect(0, 0, pdf.w, 15, 'F')
        
        pdf.set_text_color(255, 255, 255)  # לבן
        if bold_font_available:
            pdf.set_font("Alef", 'B', 18)
        else:
            pdf.set_font("Alef", '', 18)
        
        # תיקון הכותרת - הפיכת הכיוון!
        header_text_original = "מערך שיעור - EduShare"
        header_text = reverse_rtl_text(header_text_original)
        pdf.set_xy((pdf.w - pdf.get_string_width(header_text)) / 2, 5)
        pdf.cell(0, 8, header_text, 0, 1, 'C')
        
        pdf.set_text_color(0, 0, 0)  # חזרה לשחור
        pdf.ln(15)
        
        # עיבוד התוכן
        lines = content.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                pdf.ln(4)
                continue
            
            # כותרות ראשיות (###)
            if line.startswith('###'):
                pdf.ln(8)
                title_text = line.replace('###', '').strip()
                
                # רקע צבעוני לכותרת
                pdf.set_fill_color(52, 152, 219)  # כחול בהיר
                
                if bold_font_available:
                    pdf.set_font("Alef", 'B', 16)
                else:
                    pdf.set_font("Alef", '', 16)
                
                pdf.set_text_color(255, 255, 255)
                
                # מרכוז הכותרת
                text_width = pdf.get_string_width(title_text) + 20
                x_pos = (pdf.w - text_width) / 2
                pdf.set_xy(x_pos, pdf.get_y())
                pdf.cell(text_width, 12, title_text, 0, 1, 'C', True)
                
                pdf.set_text_color(0, 0, 0)
                pdf.ln(6)
            
            # כותרות משניות (####)
            elif line.startswith('####'):
                pdf.ln(6)
                subtitle_text = line.replace('####', '').strip()
                
                pdf.set_fill_color(236, 240, 241)  # אפור בהיר
                pdf.set_text_color(52, 73, 94)    # כחול כהה
                
                if bold_font_available:
                    pdf.set_font("Alef", 'B', 14)
                else:
                    pdf.set_font("Alef", '', 14)
                
                text_width = pdf.get_string_width(subtitle_text) + 16
                x_pos = pdf.w - pdf.r_margin - text_width
                pdf.set_xy(x_pos, pdf.get_y())
                pdf.cell(text_width, 10, subtitle_text, 0, 1, 'C', True)
                
                pdf.set_text_color(0, 0, 0)
                pdf.ln(4)
            
            # פריטי רשימה מספריים
            elif re.match(r'^\d+\.', line) or line.startswith('-'):
                pdf.set_font("Alef", '', 12)
                pdf.set_text_color(44, 62, 80)
                
                # הוספת bullet יפה
                bullet_text = "• "
                line_without_number = re.sub(r'^\d+\.?\s*', '', line)
                line_without_dash = line_without_number.lstrip('- ')
                full_text = bullet_text + line_without_dash
                
                # מיקום מימין
                x_pos = pdf.w - pdf.r_margin - pdf.get_string_width(full_text)
                if x_pos < pdf.l_margin:
                    x_pos = pdf.l_margin
                
                pdf.set_x(x_pos)
                pdf.cell(0, 8, full_text, 0, 1, 'R')
                pdf.set_text_color(0, 0, 0)
                pdf.ln(2)
            
            # טקסט רגיל
            else:
                pdf.set_font("Alef", '', 12)
                pdf.set_text_color(33, 37, 41)  # אפור כהה נעים
                
                # פיצול שורות ארוכות
                max_width = pdf.w - pdf.l_margin - pdf.r_margin - 20
                words = line.split()
                current_line = ""
                
                for word in words:
                    test_line = current_line + " " + word if current_line else word
                    if pdf.get_string_width(test_line) <= max_width:
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
                
                pdf.set_text_color(0, 0, 0)
                pdf.ln(3)
        
        # Footer מעוצב - עם תיקון הכיוון!
        pdf.ln(15)
        pdf.set_font("Alef", '', 10)
        pdf.set_text_color(127, 140, 141)
        
        # קו הפרדה
        pdf.set_draw_color(200, 200, 200)
        pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
        pdf.ln(8)
        
        # תיקון הפוטר - הפיכת הכיוון!
        footer_text_original = "נוצר באמצעות מערכת EduShare AI"
        footer_text = reverse_rtl_text(footer_text_original)
        footer_width = pdf.get_string_width(footer_text)
        pdf.set_xy((pdf.w - footer_width) / 2, pdf.get_y())
        pdf.cell(footer_width, 8, footer_text, 0, 0, 'C')
        
        pdf.output(output_path, "F")
        print(f"PDF נשמר בהצלחה: {output_path}")
        
    except Exception as e:
        print(f"save_to_pdf: Error saving to PDF: {e}")
        raise e

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

# === נקודת קצה ראשית לעיבוד קובץ - מושלמת! ===
@app.post("/process-file")
async def process_file(body: FileUrl, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = authorization.replace("Bearer ", "")
    file_url = body.file_url
    lesson_id = body.lesson_id

    try:
        # הורדת הקובץ
        print("מתחיל להוריד קובץ:", file_url)
        response = requests.get(file_url)
        if response.status_code != 200:
            print("שגיאה בהורדת הקובץ - קוד סטטוס:", response.status_code)
            raise HTTPException(status_code=400, detail="Failed to download file")

        ext = file_url.split('.')[-1].split('?')[0]
        print("סוג הקובץ:", ext)   
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp:
            temp.write(response.content)
            temp.flush()
            temp_path = temp.name

        # שליפת טקסט
        print("מחלץ טקסט מהקובץ...")
        extracted_text = extract_text(temp_path)
        print("טקסט חולץ בהצלחה, אורך:", len(extracted_text))

        # יצירת מערך שיעור
        print("יוצר מערך שיעור עם OpenAI...")
        lesson_plan = generate_lesson_plan(extracted_text)
        print("מערך שיעור נוצר בהצלחה")
        
        # הפיכת כיוון הטקסט - השלב הקריטי!
        print("מהפך את כיוון הטקסט העברי...")
        lesson_plan = reverse_rtl_text(lesson_plan)
        print("כיוון הטקסט הופך בהצלחה")
        
        # שמירה ל-PDF המעוצב והמושלם
        print("יוצר PDF מעוצב...")
        pdf_path = temp_path + ".pdf"
        save_to_pdf(lesson_plan, pdf_path)
        print("PDF נוצר בהצלחה")

        tmp_file_name = f"lessonId_{lesson_id}_summary.pdf"

        # בקשת URL חתום להעלאה
        print("מבקש URL להעלאה...")
        presigned_data = get_presigned_upload_url(tmp_file_name, "application/pdf", token)
        upload_url = presigned_data["url"]

        # שליפת fileKey מתוך ה-URL
        file_key = upload_url.split(".com/")[1].split("?")[0]

        # העלאת הקובץ
        print("מעלה קובץ ל-S3...")
        upload_file_to_s3(upload_url, pdf_path, "application/pdf")
        print("קובץ הועלה בהצלחה")

        # בקשת URL לצפייה
        print("מבקש URL לצפייה...")
        view_url = get_presigned_view_url(file_key, token)

        print(f"קישור מקורי: {file_url}")
        print(f"קישור לצפייה: {view_url}")
        print(f"מפתח קובץ: {file_key}")

        pdf_size = os.path.getsize(pdf_path)
        
        # ניקוי קבצים זמניים
        os.remove(temp_path)
        os.remove(pdf_path)
        print("קבצים זמניים נמחקו")

        # החזרת פרטים לשמירה ב-DB
        return JSONResponse(content={
            "file_name": f"lessonId_{lesson_id}_summary.pdf",
            "fileKey": file_key,
            "viewUrl": view_url,
            "size": pdf_size,
            "status": "success",
            "message": "PDF נוצר והועלה בהצלחה עם טקסט עברי תקין!"
        })
    
    except Exception as e:
        print(f"שגיאה כללית: {str(e)}")
        raise HTTPException(status_code=500, detail=f"שגיאה בעיבוד הקובץ: {str(e)}")

# === הוספת endpoint לבדיקת מצב השירות ===
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "EduShare AI Service",
        "version": "2.0",
        "features": ["Hebrew RTL Support", "Beautiful PDF Generation", "AWS S3 Integration"]
    }
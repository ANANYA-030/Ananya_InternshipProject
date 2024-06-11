from flask import Flask, request, jsonify
from pymongo import MongoClient
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import bcrypt
import random
import string
from datetime import datetime

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["WezenDB"]
users_collection = db["users"]
contacts_collection = db["contacts"]
reset_tokens_collection = db["reset_tokens"]

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
GMAIL_USERNAME = "xyz@gmail.com"
GMAIL_PASSWORD = "abcdefghijklmnop"

def send_email(recipient_email, subject, body):
    message = MIMEMultipart()
    message["From"] = GMAIL_USERNAME
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(GMAIL_USERNAME, GMAIL_PASSWORD)
        server.sendmail(GMAIL_USERNAME, recipient_email, message.as_string())

def send_contact_email(from_email, subject, body):
    message = MIMEMultipart()
    message["From"] = from_email
    message["To"] = GMAIL_USERNAME
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(GMAIL_USERNAME, GMAIL_PASSWORD)
        server.sendmail(from_email, GMAIL_USERNAME, message.as_string())

@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        # Retrieve data from request body
        data = request.json
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        from_email = data.get('email')
        message = data.get('message')

        # Prepare email content
        subject = "New Contact Form Submission"
        body = f"First Name: {first_name}\nLast Name: {last_name}\nEmail: {from_email}\nMessage: {message}"

        # Send email
        send_contact_email(from_email, subject, body)

        # Return a success message
        return jsonify({"message": "Your message has been received!"}), 200

    except Exception as e:
        print(f"Error processing contact form: {e}")
        return jsonify({"message": "An error occurred while processing your request."}), 500


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password before storing it
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store user details in MongoDB
    user = {
        "email": email,
        "password": hashed_password  
    }
    users_collection.insert_one(user)

    # Send registration email to the user
    registration_subject = "Registration Confirmation"
    registration_body = "Thank you for registering!"
    send_email(email, registration_subject, registration_body)

    return jsonify({"message": "User registered successfully"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    # Find user by email
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "Invalid email"}), 401
    
    # Check if passwords match
    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"message": "Invalid password"}), 401
    
    return jsonify({"message": "Login successful"}), 200


@app.route('/api/request-reset-password', methods=['POST'])
def request_reset_password():
    data = request.get_json()
    email = data.get('email')
    
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "Email not registered"}), 400

    reset_code = ''.join(random.choices(string.digits, k=5))

    reset_tokens_collection.update_one(
        {"email": email},
        {"$set": {"reset_code": reset_code, "created_at": datetime.utcnow()}},
        upsert=True
    )

    reset_email_subject = "Password Reset Code"
    reset_email_body = f"Your password reset code is: {reset_code}"
    send_email(email, reset_email_subject, reset_email_body)

    return jsonify({"message": "Password reset code sent"}), 200

@app.route('/api/verify-reset-code', methods=['POST'])
def verify_reset_code():
    data = request.get_json()
    email = data.get('email')
    reset_code = data.get('resetCode')
    print(f"Invalid reset code: {reset_code}")
    print(f"Invalid reset code: {email}")
    
    
    token = reset_tokens_collection.find_one({"email": email, "reset_code": reset_code})
    if not token:
        return jsonify({"message": "Invalid reset code"}), 400

    return jsonify({"message": "Reset code verified"}), 200

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    reset_code = data.get('resetCode')
    new_password = data.get('newPassword')
    confirm_password = data.get('confirmPassword')

    if new_password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    token = reset_tokens_collection.find_one({"email": email, "reset_code": reset_code})
    if not token:
        return jsonify({"message": "Invalid reset code"}), 400

    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

    users_collection.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )

    reset_tokens_collection.delete_one({"email": email, "reset_code": reset_code})

    return jsonify({"message": "Password reset successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)


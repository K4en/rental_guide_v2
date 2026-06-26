import os

from passlib.hash import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from fastapi import FastAPI, Request, Response
import sqlite3

from starlette.middleware.cors import CORSMiddleware
from datamodels import (
    UserCreate,
    PropertyCreate,
    GuideCreate,
    UserMe,
)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TOKEN STUFF ---
SECRET_KEY = "this-is-a-long-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(user_id: int):
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def get_current_user(token: str):

    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload["sub"]
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    return user

# ---- ENDPOINTS ----

# --- DEV-ENDS ---

# -- USERS --
@app.get("/dev/users")
def list_users():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    conn.close()
    return users

@app.get("/dev/users/{user_id}")
def show_user(user_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return user

@app.post("/dev/users")
def create_user(user: UserCreate):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    hashed = bcrypt.hash(user.password)
    cursor.execute("INSERT INTO users (email, password_hash, created_at) VALUES (?,?,?)",
                   (user.email, hashed, datetime.now()))
    conn.commit()
    conn.close()
    return {"message": "User created successfully"}

# -- PROPERTIES --
@app.get("/dev/properties")
def list_properties():
    conn = sqlite3.connect("database.db")
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties")
    properties = cursor.fetchall()
    conn.close()
    return properties

@app.get("/dev/properties/{property_id}")
def show_property(property_id: int):
    conn = sqlite3.connect("database.db")
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ?",
                   (property_id,))
    properties = cursor.fetchone()
    conn.close()
    return properties

@app.post("/dev/properties")
def create_property(property: PropertyCreate):
    conn = sqlite3.connect("database.db")
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO properties (user_id, name, address, created_at)"
                   " VALUES (?,?,?,?)",
                   (property.user_id, property.name, property.address, datetime.now()))
    conn.commit()
    conn.close()
    return {"message": "Property created successfully"}

# -- GUIDE --
@app.get("/dev/guides/{property_id}")
def show_guide(property_id: int):
    conn = sqlite3.connect("database.db")
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM guideContent WHERE property_id = ?", (property_id,))
    guide = cursor.fetchall()
    conn.close()
    return guide

@app.post("/dev/guides/{property_id}")
def create_guide(property_id: int, guide: GuideCreate):
    conn = sqlite3.connect("database.db")
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO guideContent"
                   " (property_id, title, content, sort_order, created_at)"
                   " VALUES (?,?,?,?,?)",
                   (property_id, guide.title, guide.content, guide.sort_order, datetime.now()))
    conn.commit()
    conn.close()
    return {"message": "Guide created successfully"}

# --- REAL ENDPOINTS ---
@app.post("/register")
def register_user(user: UserCreate):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    hashed = bcrypt.hash(user.password)
    cursor.execute("INSERT INTO users (email, password_hash, created_at) VALUES (?,?,?)",
                   (user.email, hashed, datetime.now()))
    conn.commit()
    conn.close()
    return {"message": "User created successfully"}

@app.post("/login")
def login_user(user: UserCreate):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?",
                   (user.email,))
    db_user = cursor.fetchone()
    print(db_user)
    stored_hash = db_user[2]
    if bcrypt.verify(user.password, stored_hash):
        token = create_access_token(db_user[0])
        return { "access_token" : token, "token_type" : "bearer" }

@app.get("/me")
def me(token: str):
    user_me = get_current_user(token)
    return {
    "id": user_me[0],
    "email": user_me[1],
    "created_at": user_me[3]
}

@app.get("/my-properties")
def show_properties(user_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE user_id = ?",
                   (user_id,))
    properties = cursor.fetchall()
    conn.close()
    return properties

@app.post("/properties")
def create_property(property: PropertyCreate):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO properties (user_id, name, address, created_at)"
                   " VALUES (?,?,?,?)",
                   (property.user_id, property.name, property.address, datetime.now()))
    conn.commit()
    conn.close()
    return {"message": "Property created successfully"}

@app.get("/properties/{property_id}")
def show_property(property_id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ?",
                   (property_id,))
    property = cursor.fetchone()
    conn.close()
    return property

@app.get("/properties/{id}/guide-content")
def show_guide_content(id: int):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM guideContent WHERE property_id = ?",
                   (id,))
    guide_content = cursor.fetchall()
    conn.close()
    return guide_content

@app.post("/guides/{property_id}")
def create_guide(property_id: int, guide: GuideCreate):
    conn = sqlite3.connect("database.db")
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO guideContent"
                   " (property_id, title, content, sort_order, created_at)"
                   " VALUES (?,?,?,?,?)",
                   (property_id, guide.title, guide.content, guide.sort_order, datetime.now()))
    conn.commit()
    conn.close()
    return {"message": "Guide created successfully"}
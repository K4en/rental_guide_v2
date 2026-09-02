import os
from passlib.hash import bcrypt
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import FastAPI, Request, Response, Depends, HTTPException, status
import sqlite3
from fastapi.security import OAuth2PasswordBearer

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
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(user_id: int):
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        conn.close()
        if not user:
            raise HTTPException(status_code=401, detail="Could not validate credentials.")
        return user

    except (JWTError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
        )

# ---- ENDPOINTS ----
# ---===---===---===---===

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
    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    stored_hash = db_user[2]
    if bcrypt.verify(user.password, stored_hash):
        token = create_access_token(db_user[0])
        return { "access_token" : token, "token_type" : "bearer" }
    else:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

@app.get("/me")
def me(current_user = Depends(get_current_user)):
    return {
    "id": current_user[0],
    "email": current_user[1],
    "created_at": current_user[3]
}

@app.get("/my-properties")
def show_properties(current_user = Depends(get_current_user)):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE user_id = ?",
                   (current_user[0],))
    db_properties = cursor.fetchall()
    conn.close()
    properties = []

    for property in db_properties:
        properties.append({
            "id": property[0],
            "name": property[2],
            "address": property[3],
            "created_at": property[4]
        })
    return properties

@app.post("/properties")
def create_property(new_property: PropertyCreate, current_user = Depends(get_current_user)):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO properties (user_id, name, address, created_at)"
                   " VALUES (?,?,?,?)",
                   (current_user[0], new_property.name, new_property.address, datetime.now()))
    conn.commit()
    conn.close()
    return {
        "message": "Property created successfully"}

@app.get("/properties/{property_id}")
def show_property(property_id: int, current_user = Depends(get_current_user)):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ? AND user_id = ?",
                   (property_id, current_user[0]))
    db_property = cursor.fetchone()
    conn.close()
    return {
        "id": db_property[0],
        "name": db_property[2],
        "address": db_property[3],
        "created_at": db_property[4]
    }

@app.get("/properties/{property_id}/guide-content")
def show_guide_content(property_id: int, current_user = Depends(get_current_user)):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
                        SELECT gc.* 
                        FROM guideContent gc 
                        JOIN properties p 
                        ON gc.property_id = p.id 
                        WHERE gc.property_id = ?
                        AND p.user_id = ?
                        """,
                   (property_id, current_user[0]))
    guide_content = cursor.fetchall()
    conn.close()
    return[
        {
            "id": row[0],
            "title": row[2],
            "content": row[3],
            "sort_order": row[4]
        }
        for row in guide_content
    ]

@app.post("/guides/{property_id}")
def create_guide(property_id: int,
                 guides: list[GuideCreate],
                 current_user = Depends(get_current_user)):
    conn = sqlite3.connect("database.db")
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ? AND user_id = ?",
                   (property_id, current_user[0]))

    db_property = cursor.fetchone()

    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")

    for guide in guides:
        cursor.execute("INSERT INTO guideContent"
                       " (property_id, title, content, sort_order, created_at)"
                       " VALUES (?,?,?,?,?)",
                       (property_id, guide.title, guide.content, guide.sort_order, datetime.now()))
    conn.commit()
    cursor.execute("SELECT * FROM guideContent")
    print(cursor.fetchall())
    conn.close()
    return {"message": "Guide created successfully"}

@app.patch("/guides/{property_id}")
def update_guide(property_id: int,
                 guides: list[GuideCreate],
                 current_user = Depends(get_current_user)):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
                        SELECT gc.*
                        FROM guideContent gc
                        JOIN properties p
                        ON gc.property_id = p.id
                        WHERE gc.property_id = ?
                        AND p.user_id = ?
                        """,
                   (property_id, current_user[0]))

    db_guide = cursor.fetchone()
    if db_guide is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Guide not found")

    for guide in guides:
        cursor.execute("""
                        UPDATE guideContent
                        SET 
                        content = ? 
                        WHERE property_id = ?
                        AND sort_order = ?
                        """,
                       (guide.content, property_id, guide.sort_order))
    conn.commit()
    conn.close()
    return {"message": "Guide updated successfully"}


@app.delete("/guides/{property_id}")
def delete_guide(property_id: int, current_user = Depends(get_current_user)):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
                    SELECT gc.*
                    FROM guideContent gc
                    JOIN properties p
                    ON gc.property_id = p.id
                    WHERE gc.property_id = ?
                    AND p.user_id = ?
                    """,
                   (property_id, current_user[0]))

    db_guide = cursor.fetchone()

    if db_guide is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Guide not found")

    cursor.execute("""DELETE FROM guideContent
                   WHERE property_id = ?""",
                   (property_id,))
    conn.commit()
    conn.close()
    return {"message": "Guide deleted successfully"}

# --- Public guide Endpoint ---
@app.get("/public/properties/{property_id}/guide-content")
def show_properties_guide_content(property_id: int,):
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT gc.*
        FROM guideContent gc
        WHERE gc.property_id = ?
        """, (property_id,))

    guide_content = cursor.fetchall()
    conn.close()
    return [
        {
            "id": row[0],
            "title": row[2],
            "content": row[3],
            "sort_order": row[4]
        }
        for row in guide_content
    ]
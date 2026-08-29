from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

class UserMe(BaseModel):
    email: str

class PropertyCreate(BaseModel):
    name: str
    address: str

class GuideCreate(BaseModel):
    title: str
    content: str
    sort_order: int

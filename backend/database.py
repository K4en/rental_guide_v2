import sqlite3
conn = sqlite3.connect('database.db')
conn.execute("PRAGMA foreign_keys = ON")
cursor = conn.cursor()

cursor.execute("""
               CREATE TABLE IF NOT EXISTS users (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               email TEXT NOT NULL UNIQUE,
               password_hash TEXT NOT NULL,
               created_at TIMESTAMP NOT NULL
               )
               """)
cursor.execute("""CREATE TABLE IF NOT EXISTS properties (
               id INTEGER PRIMARY KEY AUTOINCREMENT, 
               user_id INTEGER NOT NULL, 
               name TEXT NOT NULL, 
               address TEXT NOT NULL, 
               created_at TIMESTAMP NOT NULL,
               FOREIGN KEY (user_id) REFERENCES users(id)
               )
               """)
cursor.execute("""CREATE TABLE IF NOT EXISTS guideContent ( 
               id INTEGER PRIMARY KEY AUTOINCREMENT, 
               property_id INTEGER NOT NULL, 
               title TEXT NOT NULL,  
               content TEXT NOT NULL, 
               sort_order INTEGER NOT NULL, 
               created_at TIMESTAMP NOT NULL,
               FOREIGN KEY (property_id) REFERENCES properties(id)
               )
               """)
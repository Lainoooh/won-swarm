"""添加 project.current_step 字段的迁移脚本"""
import sqlite3

DB_PATH = "/Users/wl/.openclaw/claude_workspace/backend/wonswarm.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 检查字段是否存在
cursor.execute("PRAGMA table_info(projects)")
columns = [col[1] for col in cursor.fetchall()]

if "current_step" not in columns:
    cursor.execute("ALTER TABLE projects ADD COLUMN current_step INTEGER DEFAULT 1")
    print("已添加 current_step 字段到 projects 表")
else:
    print("current_step 字段已存在")

conn.commit()
conn.close()
print("迁移完成！")

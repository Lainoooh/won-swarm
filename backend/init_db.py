#!/usr/bin/env python3
"""
初始化数据库和管理员账号
"""
import sys
sys.path.insert(0, '/Users/wl/.openclaw/claude_workspace/backend')

from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.utils.security import hash_password
import uuid

# 创建所有表
Base.metadata.create_all(bind=engine)

# 创建默认管理员账号
db = SessionLocal()

admin = db.query(User).filter(User.username == "admin").first()
if not admin:
    admin = User(
        id=str(uuid.uuid4()),
        username="admin",
        password_hash=hash_password("123456"),
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("✅ 管理员账号创建成功")
    print("   用户名：admin")
    print("   密码：123456")
else:
    print("ℹ️  管理员账号已存在")

db.close()
print("✅ 数据库初始化完成")

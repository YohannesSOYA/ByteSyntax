import bcrypt
passwords = ['1234', 'abcd', '8888', 'gold']
for p in passwords:
    h = bcrypt.hashpw(p.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    print(f"{p}: {h}")

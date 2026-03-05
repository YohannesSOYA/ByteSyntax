import bcrypt
passwords = ['1234', 'abcd', '8888', 'gold']
with open('hashes_utf8.txt', 'w', encoding='utf-8') as f:
    for p in passwords:
        h = bcrypt.hashpw(p.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        f.write(f"{p}: {h}\n")

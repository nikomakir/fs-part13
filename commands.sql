CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES (
    'Michael Chan',
    'https://reactpatterns.com/',
    'React patterns'
);

INSERT INTO blogs (author, url, title) VALUES (
    'Edsger W. Dijkstra',
    'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    'Canonical string reduction'
);
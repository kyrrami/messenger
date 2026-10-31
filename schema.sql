CREATE TABLE Users (
    id SERIAL PRIMARY KEY, 
    login VARCHAR (30) NOT NULL UNIQUE,
    password VARCHAR (255) NOT NULL,
    username VARCHAR(30) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE
);

CREATE TABLE Chats (
    id SERIAL PRIMARY KEY, 
    id_users_1 INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    id_users_2 INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    CHECK (id_users_1 < id_users_2),
    UNIQUE (id_users_1, id_users_2)
);

CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    id_chat INT NOT NULL REFERENCES Chats(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    date TIMESTAMP DEFAULT NOW()
);
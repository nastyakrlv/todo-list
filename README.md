# TodoList

Установка зависимостей

```sh
npm ci
```

Запуск проекта

```sh
npm run start
```

[MockApi](https://mockapi.io/projects/66fd80996993693089556893)

Запросы по ссылке

```sh
https://66fd80996993693089556892.mockapi.io/api/:endpoint
```

Эндпоинты: users, projects

## Контракты

```
users: [
    {
        id: String, // генерируется автоматически
        name: String,
        email: String,
        password: String,
        projects: [
            {
                id: String
            },
            ...
        ]
    },
    ...
]
```

```
projects: [
    {
        id: String,
        name: String,
        users: [
            {
                id: String,
                rolt: String
            },
            ...
        ],
        categories: [
            {
                id: String, // генерируем на фронте uuid
                name: String
            },
            ...
        ],
        tasks: [
            {
                id: String, // генерируем на фронте uuid
                name: String,
                description: String,
                date: String,
                badge: String,
                categoryId: String,
                userId: String
            },
            ...
        ]
    },
    ...
]
```



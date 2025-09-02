---
title: 'Build a User Management App with React'
description: 'Learn how to use Supabase in your React App.'
---

<$Partial path="quickstart_intro.mdx" />

![Supabase User Management example](/docs/img/user-management-demo.png)

<Admonition type="note">

If you get stuck while working through this guide, refer to the [full example on GitHub](https://github.com/supabase/supabase/tree/master/examples/user-management/react-user-management).

</Admonition>

<$Partial path="project_setup.mdx" />

## Building the app

Let's start building the React app from scratch.

### Initialize a React app

We can use [Vite](https://vitejs.dev/guide/) to initialize
an app called `supabase-react`:

```bash
npm create vite@latest supabase-react -- --template react
cd supabase-react
```

Then let's install the only additional dependency: [supabase-js](https://github.com/supabase/supabase-js).

```bash
npm install @supabase/supabase-js
```

And finally we want to save the environment variables in a `.env.local` file.
All we need are the API URL and the `anon` key that you copied [earlier](#get-the-api-keys).

<$CodeTabs>

```bash name=.env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

</$CodeTabs>

Now that we have the API credentials in place, let's create a helper file to initialize the Supabase client. These variables will be exposed
on the browser, and that's completely fine since we have [Row Level Security](/docs/guides/auth#row-level-security) enabled on our Database.

Create and edit `src/supabaseClient.js`:

<$CodeTabs>

```js name=src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

</$CodeTabs>

### App styling (optional)

An optional step is to update the CSS file `src/index.css` to make the app look nice.
You can find the full contents of this file [here](https://raw.githubusercontent.com/supabase/supabase/master/examples/user-management/react-user-management/src/index.css).

### Set up a login component

Let's set up a React component to manage logins and sign ups. We'll use Magic Links, so users can sign in with their email without using passwords.

Create and edit `src/Auth.jsx`:

<$CodeTabs>

```jsx name=src/Auth.jsx
import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in via magic link with your email below</p>
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button className={'button block'} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

</$CodeTabs>

### Account page

After a user is signed in we can allow them to edit their profile details and manage their account.

Let's create a new component for that called `src/Account.jsx`.

<$CodeTabs>

```jsx name=src/Account.jsx
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setUsername(data.username)
          setWebsite(data.website)
          setAvatarUrl(data.avatar_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={updateProfile} className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          required
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  )
}
```

</$CodeTabs>

### Launch!

Now that we have all the components in place, let's update `src/App.jsx`:

<$CodeTabs>

```jsx name=src/App.jsx
import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}

export default App
```

</$CodeTabs>

Once that's done, run this in a terminal window:

```bash
npm run dev
```

And then open the browser to [localhost:5173](http://localhost:5173) and you should see the completed app.

![Supabase React](/docs/img/supabase-react-demo.png)

## Bonus: Profile photos

Every Supabase project is configured with [Storage](/docs/guides/storage) for managing large files like photos and videos.

### Create an upload widget

Let's create an avatar for the user so that they can upload a profile photo. We can start by creating a new component:

Create and edit `src/Avatar.jsx`:

<$CodeTabs>

```jsx name=src/Avatar.jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
```

</$CodeTabs>

### Add the new widget

And then we can add the widget to the Account page at `src/Account.jsx`:

<$CodeTabs>

```jsx name=src/Account.jsx
// Import the new component
import Avatar from './Avatar'

// ...

return (
  <form onSubmit={updateProfile} className="form-widget">
    {/* Add to the body */}
    <Avatar
      url={avatar_url}
      size={150}
      onUpload={(event, url) => {
        updateProfile(event, url)
      }}
    />
    {/* ... */}
  </form>
)
```

</$CodeTabs>

At this stage you have a fully functional application!

В этом руководстве показано, как создать базовое приложение для управления пользователями. Приложение выполняет аутентификацию и идентификацию пользователя, сохраняет информацию о его профиле в базе данных и позволяет пользователю входить в систему, обновлять данные своего профиля и загружать фотографию профиля. В приложении используются:

База данных Supabase — база данных Postgres для хранения пользовательских данных и защиты на уровне строк, благодаря которой данные защищены и пользователи могут получать доступ только к своей информации.
Supabase Auth — позволяет пользователям регистрироваться и входить в систему.
Хранилище Supabase — позволяет пользователям загружать фотографию профиля.
Пример управления пользователями в Supabase

Если вы застряли на каком-то этапе при работе с этим руководством, обратитесь к полному примеру на GitHub.

Настройка проекта#
Прежде чем приступить к созданию, необходимо настроить базу данных и API. Для этого нужно создать новый проект в Supabase, а затем «схему» внутри базы данных.

Создать проект#
Создайте новый проект на панели управления Supabase.
Введите данные вашего проекта.
Дождитесь запуска новой базы данных.
Настройте схему базы данных#
Теперь настройте схему базы данных. Вы можете воспользоваться быстрым стартом «Управление пользователями» в редакторе SQL или скопировать/вставить приведенный ниже SQL-код и запустить его.


Информационная панель

SQL
Перейдите на страницу SQL Editor в панели управления.
Нажмите Начало управления пользователями на вкладке Сообщество > Быстрые запуски.
Нажмите "Выполнить".
Вы можете перенести схему базы данных в свой локальный проект, выполнив команду db pull . Подробные инструкции приведены в документации по локальной разработке.

supabase link --project-ref <project-id>
# You can get <project-id> from your project's dashboard URL: https://supabase.com/dashboard/project/<project-id>
supabase db pull
Получите ключи API#
Теперь, когда вы создали несколько таблиц в базе данных, вы можете вставлять данные с помощью автоматически сгенерированного API.

Для этого вам нужно получить URL проекта и ключ anon из настроек API.

Перейдите на страницу Настройки API в панели управления.
Найдите на этой странице ключи Project URL, anon, и service_role.
Создание приложения#
Давайте начнём создавать приложение React с нуля.

Инициализируйте приложение React#
Мы можем использовать Vite для инициализации приложения под названием supabase-react:

npm create vite@latest supabase-react -- --template react
cd supabase-react
Затем давайте установим единственную дополнительную зависимость: supabase-js.

npm install @supabase/supabase-js
И наконец, мы хотим сохранить переменные среды в файле .env.local.
Всё, что нам нужно, — это URL-адрес API и ключ anon, который вы скопировали ранее.


.env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
Теперь, когда у нас есть учётные данные API, давайте создадим вспомогательный файл для инициализации клиента Supabase. Эти переменные будут доступны в браузере, и это совершенно нормально, поскольку в нашей базе данных включена защита на уровне строк.

Создание и редактирование src/supabaseClient.js:


src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
Оформление приложения (необязательно) #
Необязательный шаг — обновление файла CSS src/index.css, чтобы приложение выглядело красиво. Полное содержимое этого файла можно найти здесь.

Настройте компонент для входа в систему#
Давайте создадим компонент React для управления входами и регистрациями. Мы будем использовать Magic Links, чтобы пользователи могли входить в систему, используя только адрес электронной почты, без пароля.

Создание и редактирование src/Auth.jsx:


src/Auth.jsx
import { useState } from 'react'
import { supabase } from './supabaseClient'
export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }
  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in via magic link with your email below</p>
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button className={'button block'} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
Страница учетной записи#
После того как пользователь войдёт в систему, мы сможем разрешить ему редактировать данные своего профиля и управлять своей учётной записью.

Давайте создадим для этого новый компонент под названием src/Account.jsx.


src/Учетная запись.jsx
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  useEffect(() => {
    let ignore = false
    async function getProfile() {
      setLoading(true)
      const { user } = session
      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()
      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setUsername(data.username)
          setWebsite(data.website)
          setAvatarUrl(data.avatar_url)
        }
      }
      setLoading(false)
    }
    getProfile()
    return () => {
      ignore = true
    }
  }, [session])
  async function updateProfile(event, avatarUrl) {
    event.preventDefault()
    setLoading(true)
    const { user } = session
    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }
    const { error } = await supabase.from('profiles').upsert(updates)
    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }
  return (
    <form onSubmit={updateProfile} className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          required
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="url"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>
      <div>
        <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  )
}
Запуск!#
Теперь, когда все компоненты на месте, давайте обновим src/App.jsx:


src/App.jsx
import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'
function App() {
  const [session, setSession] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
    </div>
  )
}
export default App
Как только это будет сделано, запустите в окне терминала следующую команду:

npm run dev
Затем откройте браузер и перейдите по адресу localhost:5173. Вы должны увидеть готовое приложение.

Реакция Супабазы

Бонус: фотографии в профиле#
Каждый проект Supabase настраивается с помощью Storage для управления большими файлами, такими как фотографии и видео.

Создайте виджет для загрузки#
Давайте создадим аватарку для пользователя, чтобы он мог загрузить фотографию в профиль. Для начала создадим новый компонент:

Создание и редактирование src/Avatar.jsx:


src/Avatar.jsx
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])
  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }
  async function uploadAvatar(event) {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
      if (uploadError) {
        throw uploadError
      }
      onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }
  return (
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
Добавить новый виджет#
А затем мы можем добавить виджет на страницу учетной записи по адресу src/Account.jsx:


src/Account.jsx
// Import the new component
import Avatar from './Avatar'
// ...
return (
  <form onSubmit={updateProfile} className="form-widget">
    {/* Add to the body */}
    <Avatar
      url={avatar_url}
      size={150}
      onUpload={(event, url) => {
        updateProfile(event, url)
      }}
    />
    {/* ... */}
  </form>
)
На этом этапе у вас есть полностью функциональное приложение!
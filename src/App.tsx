import { Response, UserProps, RepositoryProps } from './pages/Response'
import { AllRepositories } from './pages/AllRepositories'
import { Switch } from '@mui/material'
import { useEffect, useState } from 'react'
import api from './services/api'

function App() {
  const [onlyFour, setOnlyFour] = useState(true)
  const [dark, setDark] = useState(true)
  const [userData, setUserData] = useState({} as UserProps)
  const [reposData, setReposData] = useState<RepositoryProps[] | undefined>()
  const [allReposData, setallReposData] = useState<
    RepositoryProps[] | undefined
  >()
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState(404)

  async function reposSearch() {
    const reposResponse: any = await api.get(username + '/repos')
    const topFours: RepositoryProps[] = []
    const tmp: RepositoryProps[] = []
    reposResponse.data.map((repo: any) => {
      if (!repo.fork) {
        const dataRepo: RepositoryProps = {
          title: repo.name,
          forks: repo.forks,
          description: repo.description,
          htmlUrl: repo.html_url,
        }
        tmp.push(...[dataRepo])
      }
    })
    tmp.sort((a, b) => {
      return b.forks - a.forks
    })
    setallReposData(tmp)
    for (var i = 0; i < tmp.length; i++) {
      topFours.push(...[tmp[i]])
      if (i === 3) break
    }
    setReposData(topFours)
  }

  function toggleTheme() {
    const htmltag = document.getElementById('html')
    htmltag?.classList.toggle('dark')
    if (htmltag?.getAttribute('class') === 'dark') {
      setDark(true)
      localStorage.setItem('theme', 'dark')
    } else {
      setDark(false)
      localStorage.setItem('theme', 'light')
    }
  }

  useEffect(() => {
    const themeState = localStorage.getItem('theme')
    const htmltag = document.getElementById('html')
    if (themeState === 'dark') {
      htmltag?.classList.add('dark')
    } else {
      setDark(false)
      htmltag?.classList.remove('dark')
    }
  })

  async function search() {
    const response: any = await api.get(username).catch((error) => {
      setUsername('')
      setStatus(404)
      window.alert('This user not exist')
    })
    if (response.status === 200) {
      await reposSearch()
      const data: UserProps = {
        repositories: response.data.public_repos,
        repositoriesUrl: response.data.repos_url,
        avatarUrl: response.data.avatar_url,
        followers: response.data.followers,
        username: response.data.login,
      }
      setUserData(data)
      setStatus(200)
    }
  }

  return (
    <div className='App h-screen w-screen dark:bg-slate-800 dark:text-zinc-100 bg-slate-100 text-center pt-12'>
      <h1>Welcome to github search profile</h1>
      <div className='float-right'>
        <Switch className='mr-6' checked={dark} onClick={toggleTheme} />
      </div>
      <div>
        <p>
          Find profiles{' '}
          <input
            className='border-black border-2 rounded-lg px-3 text-black'
            type='text'
            name='finder'
            value={username}
            autoComplete='off'
            onChange={(e) => setUsername(e.target.value)}
          />
        </p>
        <input
          className='w-14 bg-cyan-700 rounded-lg m-4'
          type='button'
          value='Clear'
          onClick={() => {
            setUsername('')
            setStatus(404)
          }}
        />
        <button className='w-14 bg-cyan-700 rounded-lg' onClick={search}>
          Find
        </button>
        {status === 200 && onlyFour ? (
          <div>
            <Response repos={reposData} user={userData} />
            <a>
              <p onClick={() => setOnlyFour(false)}>
                View all repositories from this user
              </p>
            </a>
          </div>
        ) : (
          status === 200 && (
            <div className='dark:bg-slate-800 dark:text-zinc-100 bg-slate-100 text-center pt-12'>
              <AllRepositories repos={allReposData} user={userData} />
              <a>
                <p onClick={() => setOnlyFour(true)}>
                  View only the top four repositories from this user
                </p>
              </a>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default App

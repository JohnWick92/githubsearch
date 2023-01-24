import { RepositoryProps, ResponseProps } from './Response'

export function AllRepositories({ user, repos }: ResponseProps) {
  return (
    <div className='mb-5'>
      <div className='grid grid-cols-2 h-48 w-3/12 items-center text-left mx-auto mt-10'>
        <img className='rounded-full w-48 ' src={user.avatarUrl} alt='avatar' />
        <div className='ml-4'>
          <p>Username: {user.username}</p>
          <p>Followers: {user.followers}</p>
          <p>Repositories: {user.repositories}</p>
        </div>
      </div>
      <div className='pt-10'>
        <p>This is all repositories based order by more forkeds</p>
        <div className='grid grid-cols-2'>
          {repos?.map((repo: RepositoryProps) => (
            <div className='items-center justify-center mt-20'>
              <a target='_blank' href={repo.htmlUrl}>
                <div className='mx-auto w-96 border-solid text-white bg-slate-700 hover:animate-bounce hover:bg-slate-400 transition-colors'>
                  <p className='my-3'>Name: {repo.title}</p>
                  <p className='my-3'>Description: {repo.description}</p>
                  <p className='my-3'>Forks: {repo.forks}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

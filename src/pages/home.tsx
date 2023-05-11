import { Link, Outlet } from 'react-router-dom'

function Home() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/csstask">CSS Tasks</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  )
}

export default Home

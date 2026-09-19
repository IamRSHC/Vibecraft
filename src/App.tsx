import BannerIntro from './components/BannerIntro'
import AmbientBackground from './components/AmbientBackground'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Rules from './components/Rules'
import Format from './components/Format'
import Rounds from './components/Rounds'
import Submit from './components/Submit'
import Prizes from './components/Prizes'
import Partners from './components/Partners'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <div className="sky" aria-hidden="true" />
      <AmbientBackground />
      <BannerIntro />

      <Nav />

      <main id="top">
        <Hero />
        <div className="divider" aria-hidden="true" />
        <About />
        <Rules />
        <Format />
        <Rounds />
        <Submit />
        <Prizes />
        <Partners />
      </main>

      <Footer />
    </>
  )
}

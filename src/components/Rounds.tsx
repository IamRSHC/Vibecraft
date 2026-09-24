import RoundsDeck from './RoundsDeck'

export default function Rounds() {
  return (
    <section className="rounds-zone" id="rounds">
      <div className="wrap">
        <div className="section-head">
          <h2>The Rounds</h2>
          <p>
            Three rounds. Round 1 is open to everyone. What's past it only unlocks once you've cleared
            it.
          </p>
        </div>
        <RoundsDeck />
      </div>
    </section>
  )
}

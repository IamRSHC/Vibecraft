import { SUBMIT_FORM_URL } from '../config'

export default function Submit() {
  return (
    <section id="submit">
      <div className="wrap">
        <div className="submit-block">
          <div className="section-head">
            <h2>Submit Your Project</h2>
            <p>
              Once you're ready, hit submit. It opens our submission form in a new tab — fill in
              everything we ask for there.
            </p>
          </div>
          <a
            href={SUBMIT_FORM_URL}
            id="submitFormLink"
            target="_blank"
            rel="noopener noreferrer"
            className="btn torch"
          >
            Submit Your Project
          </a>
        </div>
      </div>
    </section>
  )
}

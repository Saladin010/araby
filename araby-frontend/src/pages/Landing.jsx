import { Navbar, Footer } from '../components/layout'
import {
    Hero,
    Statistics,
    Features,
    HowItWorks,
    Testimonials,
    CTA,
} from '../components/landing'

const Landing = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <Statistics />
            <Features />
            <div id="how-it-works">
                <HowItWorks />
            </div>
            {/* <div id="testimonials">
                <Testimonials />
            </div> */}
            <CTA />
            <Footer />
        </div>
    )
}

export default Landing

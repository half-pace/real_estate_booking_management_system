import { useEffect, useRef, /*useState*/ } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
//import axios from 'axios';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const heroRef = useRef(null);
    //const [properties, setProperties] = useState([]);

    useEffect(() => {
        //hero animation
        gsap.from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.3
        });

        gsap.from('.hero-subtitle', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            delay: 0.6
        });

        gsap.from('.hero-buttons', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.out',
            delay: 0.9
        });

        gsap.from('.hero-stats', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power4.out',
            delay: 1.2
        });

        //feature cards animation
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
            },
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });

        //fetch properties
        //fetchProperties();
    }, []);

    // const fetchProperties = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/api/properties?status=available');
    //         setProperties(response.data.slice(0, 6));
    //     }catch (error) {
    //         console.log('Error fetching properties:', error);
    //     }
    // };

    return (
        <div className="home">
            <section className="hero" ref={heroRef}>
                <div className="hero-bg"></div>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Discover Your
                            <br />
                            <span className="highlight">Dream Property</span>
                        </h1>
                        <p className="hero-subtitle">
                            Experience luxury living with our curated collection of premium properties.
                            Your perfect home awaits.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/properties" className="btn btn-primary">
                                Explore Properties
                            </Link>
                            <a href="#features" className="btn btn-secondary">
                                Learn More
                            </a>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <h3>500+</h3>
                                <p>Premium Properties</p>
                            </div>
                            <div className="stat">
                                <h3>10K+</h3>
                                <p>Happy Clients</p>
                            </div>
                            <div className="stat">
                                <h3>50+</h3>
                                <p>Cities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Lux Estate</h2>
                        <p>Experience the finest in real estate booking</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3>Premium Selection</h3>
                            <p>Handpicked Luxury Properties that meet the highest standards</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Instant Booking</h3>
                            <p>Seamless booking experience with real-time availability</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure Payments</h3>
                            <p>Industry-leading security for your peace of mind</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💎</div>
                            <h3>Concierge Service</h3>
                            <p>24/7 support from our dedicated team of professionals</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-banner">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Find Your Dream Home?</h2>
                        <p>Join thousands of satisfied clients</p>
                        <Link to="/register" className="btn btn-primary">
                            Get Started Today
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
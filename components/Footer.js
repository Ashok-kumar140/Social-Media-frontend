import React from 'react'

import { AiFillLinkedin, AiOutlineGithub, AiFillInstagram } from 'react-icons/ai';
const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#fef2f2' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
                <div className="col-md-6" style={{textAlign:'center'}}>
                    <img src={'/images/profilepic.jpg'} alt="Founder" style={{ height: '40px',width:'40px', borderRadius: '50%' }} />
                    <h6>Ashok</h6>
                    <p><span>Designed and Developed by Ashok  </span> <span> Copyright &#169; 2023</span></p>
                </div>
                <div className="col-md-6" style={{textAlign:'center'}}>

                    <h6>Connect With Me</h6>
                    <article style={{textAlign:'center'}}>
                        <div>
                            <a href="https://www.linkedin.com/in/ashok-kumar-117b65204/" target='_blank' rel="noreferrer">
                                <AiFillLinkedin />
                            </a>
                        </div>
                        <div>
                            <a href="https://github.com/Ashok-kumar140" target='_blank' rel="noreferrer">
                                <AiOutlineGithub />
                            </a>
                        </div>
                        <div>
                            <a href="https://www.instagram.com/a.k.daukiya/" target='_blank' rel="noreferrer">
                                <AiFillInstagram />
                            </a>
                        </div>
                    </article>


                </div>
            </div>

        </footer>
    )
}

export default Footer

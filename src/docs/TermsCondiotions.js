import React, { useState } from 'react';
import Header from '../layouts/Header';
import './style.css';
import data from '../data/T&C.json';

const TermsCondiotions = () => {
    const currentSkin = localStorage.getItem('skin-mode') ? 'dark' : '';
    const [skin, setSkin] = useState(currentSkin);

    return (
        <>
            <Header onSkin={setSkin} />
            <div className="main main-app p-3 p-lg-4">
                <div className='all_title'>
                    <h1>Terms and Conditions</h1>
                </div>

                {/* Display Terms and Conditions */}
                <div className="terms-section">
                    <h1>Effective Date: {data.TermsAndConditions.EffectiveDate}</h1>
                    <p>{data.TermsAndConditions.WelcomeMessage}</p>

                    {data.TermsAndConditions.Sections.map((section, index) => (
                        <div key={index} className="section-item">
                            <h4>{section.Title}</h4>
                            {Array.isArray(section.Content) ? (
                                <ul>
                                    {section.Content.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            ) : typeof section.Content === 'object' ? (
                                <ul>
                                    {Object.entries(section.Content).map(([key, value], idx) => (
                                        <li key={idx}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{section.Content}</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Display IT Policies */}
                <div className="it-policies-section">
                    <h1>IT Policies</h1>
                    {data.ITPolicies.Policies.map((policy, index) => (
                        <div key={index} className="policy-item">
                            <h4>{policy.Title}</h4>
                            <p>{policy.Content}</p>
                        </div>
                    ))}
                    <p>{data.ITPolicies.Agreement}</p>
                </div>
            </div>
        </>
    );
};

export default TermsCondiotions;
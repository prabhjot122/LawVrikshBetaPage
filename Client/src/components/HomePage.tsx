import React, { useState } from "react";
import "./HomePage.css";

// Image URLs from public folder
const LOGO_URL = "/logo.png";
const MAIN_IMAGE_URL = "/hero.png";

function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<'form' | 'thankyou' | 'features' | 'feedback' | 'viewmore'>('form');
  const [userType, setUserType] = useState<'USER' | 'Creator'>('USER');
  const [isNotInterested, setIsNotInterested] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    profession: ''
  });

  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({
    visualDesign: '',
    easeOfNavigation: '',
    mobileResponsiveness: '',
    overallSatisfaction: '',
    easeOfTasks: '',
    qualityOfServices: '',
    likeMost: '',
    improvements: '',
    features: '',
    legalChallenges: '',
    additionalComments: '',
    contactWilling: '',
    contactEmail: '',
    // Conditional fields for low ratings
    visualDesignIssue: '',
    easeOfNavigationIssue: '',
    mobileResponsivenessIssue: '',
    overallSatisfactionIssue: '',
    easeOfTasksIssue: '',
    qualityOfServicesIssue: ''
  });

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleUserTypeClick = (type: 'USER' | 'Creator') => {
    setUserType(type);
    setPopupType('form');
    setShowPopup(true);
  };

  const handleNotInterestedClick = () => {
    setIsNotInterested(true);
    setPopupType('thankyou');
    setShowPopup(true);
  };

  const handleFeaturesClick = () => {
    setPopupType('features');
    setShowPopup(true);
  };

  const handleFeedbackClick = () => {
    setPopupType('feedback');
    setShowPopup(true);
  };

  const handleViewMoreClick = () => {
    setPopupType('viewmore');
    setShowPopup(true);
  };

  const handleFeedbackInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit registration');
      }

      setIsNotInterested(false);
      setPopupType('thankyou');
    } catch (error) {
      setSubmitError('Failed to submit registration. Please try again.');
      console.error('Registration submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    // Validate conditional fields
    const ratingFields = ['visualDesign', 'easeOfNavigation', 'mobileResponsiveness', 'overallSatisfaction', 'easeOfTasks', 'qualityOfServices'];
    const conditionalFields = ['visualDesignIssue', 'easeOfNavigationIssue', 'mobileResponsivenessIssue', 'overallSatisfactionIssue', 'easeOfTasksIssue', 'qualityOfServicesIssue'];

    for (let i = 0; i < ratingFields.length; i++) {
      const rating = parseInt(feedbackData[ratingFields[i] as keyof typeof feedbackData] as string);
      const conditionalField = conditionalFields[i] as keyof typeof feedbackData;

      if (rating && rating < 3 && !feedbackData[conditionalField]) {
        setSubmitError('Please explain what you didn\'t like for ratings below 3.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setFeedbackSubmitted(true);
      setPopupType('thankyou');
    } catch (error) {
      setSubmitError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsNotInterested(false);
    setFeedbackSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: '',
      profession: ''
    });
    setFeedbackData({
      visualDesign: '',
      easeOfNavigation: '',
      mobileResponsiveness: '',
      overallSatisfaction: '',
      easeOfTasks: '',
      qualityOfServices: '',
      likeMost: '',
      improvements: '',
      features: '',
      legalChallenges: '',
      additionalComments: '',
      contactWilling: '',
      contactEmail: '',
      visualDesignIssue: '',
      easeOfNavigationIssue: '',
      mobileResponsivenessIssue: '',
      overallSatisfactionIssue: '',
      easeOfTasksIssue: '',
      qualityOfServicesIssue: ''
    });
    setIsSubmitting(false);
    setSubmitError('');
  };
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <div className="homepage-container">
        <header className="header">
          <img src={LOGO_URL} alt="LawVriksh Logo" className="logo" />
          <nav className="navigation">
            <button className="nav-button view-more-btn" onClick={handleViewMoreClick}>
              View More
            </button>
          </nav>
        </header>

        <main className="main-content">
          <section className="content-section">
            <div className="title-container">
              <h1 className="main-title">


                <span>Join the LawVriksh Beta: Be the First to Experience</span>

              </h1>
            </div>

            <div className="subtitle-container">
              <p className="subtitle">"Know your rights. Show your insights"</p>
            </div>

            <div className="description-container">
              <p className="description">
                Lawvriksh isn't just a platform—it's your breakthrough. Dive
                into the law with passion and purpose, transform curiosity into
                confidence, and let your voice amplify justice. Share your work
                with pride, build a digital presence that demands attention, and
                join a movement where every insight sparks change. This is where
                learners rise, leaders shine, and your impact begins.
              </p>
            </div>

            <div className="waiting-list-section">
              <h2 className="waiting-list-title">Join Our Waiting List :</h2>

              <div className="user-type-selection">
                <div className="user-type-row">
                  <button
                    className="user-type-button"
                    onClick={() => handleUserTypeClick('USER')}
                  >
                    USER
                  </button>
                  <button
                    className="user-type-button"
                    onClick={() => handleUserTypeClick('Creator')}
                  >
                    Creator
                  </button>
                </div>

                <div className="divider" />

                <button
                  className="user-type-button not-interested"
                  onClick={handleNotInterestedClick}
                >
                  Not found Interest
                </button>
              </div>
            </div>
          </section>

          <aside className="image-section">
            <img
              src={MAIN_IMAGE_URL}
              alt="LawVriksh Platform Preview"
              className="main-image"
            />
          </aside>
        </main>

        {/* Popup */}
        {showPopup && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className={`popup-container ${popupType === 'feedback' ? 'feedback-popup' : ''}`} onClick={(e) => e.stopPropagation()}>
              <button className="popup-close" onClick={closePopup}>
                ×
              </button>

              {popupType === 'form' ? (
                <div className="popup-content">
                  <h2 className="popup-title">Join as {userType}</h2>
                  <form onSubmit={handleFormSubmit} className="popup-form">
                    <div className="form-group">
                      <label htmlFor="name">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="profession">Profession</label>
                      <input
                        type="text"
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        placeholder="e.g., Student, Lawyer, etc."
                      />
                    </div>

                    {submitError && (
                      <div className="error-message">
                        {submitError}
                      </div>
                    )}

                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Join Waiting List'}
                    </button>
                  </form>
                </div>
              ) : popupType === 'feedback' ? (
                <div className="popup-content feedback-content">
                  <h2 className="popup-title">Help us improve your experience</h2>
                  <p className="feedback-subtitle">
                    <em>Estimated time: 5-7 minutes</em>
                  </p>
                  <p className="feedback-description">
                    Thank you for taking the time to share your feedback. Your input helps us enhance our website to better serve your legal needs. All responses are confidential and used solely to improve our platform.
                  </p>

                  <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                    {/* User Interface Section */}
                    <div className="feedback-section">
                      <h3 className="section-title">User Interface</h3>
                      <p className="section-subtitle">Please rate the following on a scale of 1 to 5 (1 = Poor, 5 = Excellent):</p>

                      <div className="rating-group">
                        <label className="rating-label">1. Visual design and layout</label>
                        <div className="rating-options">
                          {[1, 2, 3, 4, 5].map(num => (
                            <label key={num} className="radio-label">
                              <input
                                type="radio"
                                name="visualDesign"
                                value={num.toString()}
                                checked={feedbackData.visualDesign === num.toString()}
                                onChange={handleFeedbackInputChange}
                              />
                              <span className="radio-text">{num}</span>
                            </label>
                          ))}
                        </div>
                        {parseInt(feedbackData.visualDesign) < 3 && feedbackData.visualDesign && (
                          <div className="conditional-field">
                            <label htmlFor="visualDesignIssue" className="conditional-label">
                              What didn't you like and why? *
                            </label>
                            <input
                              type="text"
                              id="visualDesignIssue"
                              name="visualDesignIssue"
                              value={feedbackData.visualDesignIssue}
                              onChange={handleFeedbackInputChange}
                              className="conditional-input"
                              required
                              placeholder="Please explain what you didn't like about the visual design..."
                            />
                          </div>
                        )}
                      </div>

                      <div className="rating-group">
                        <label className="rating-label">2. Ease of navigation</label>
                        <div className="rating-options">
                          {[1, 2, 3, 4, 5].map(num => (
                            <label key={num} className="radio-label">
                              <input
                                type="radio"
                                name="easeOfNavigation"
                                value={num.toString()}
                                checked={feedbackData.easeOfNavigation === num.toString()}
                                onChange={handleFeedbackInputChange}
                              />
                              <span className="radio-text">{num}</span>
                            </label>
                          ))}
                        </div>
                        {parseInt(feedbackData.easeOfNavigation) < 3 && feedbackData.easeOfNavigation && (
                          <div className="conditional-field">
                            <label htmlFor="easeOfNavigationIssue" className="conditional-label">
                              What didn't you like and why? *
                            </label>
                            <input
                              type="text"
                              id="easeOfNavigationIssue"
                              name="easeOfNavigationIssue"
                              value={feedbackData.easeOfNavigationIssue}
                              onChange={handleFeedbackInputChange}
                              className="conditional-input"
                              required
                              placeholder="Please explain what you didn't like about the navigation..."
                            />
                          </div>
                        )}
                      </div>

                      <div className="rating-group">
                        <label className="rating-label">3. Mobile responsiveness</label>
                        <div className="rating-options">
                          {[1, 2, 3, 4, 5].map(num => (
                            <label key={num} className="radio-label">
                              <input
                                type="radio"
                                name="mobileResponsiveness"
                                value={num.toString()}
                                checked={feedbackData.mobileResponsiveness === num.toString()}
                                onChange={handleFeedbackInputChange}
                              />
                              <span className="radio-text">{num}</span>
                            </label>
                          ))}
                        </div>
                        {parseInt(feedbackData.mobileResponsiveness) < 3 && feedbackData.mobileResponsiveness && (
                          <div className="conditional-field">
                            <label htmlFor="mobileResponsivenessIssue" className="conditional-label">
                              What didn't you like and why? *
                            </label>
                            <input
                              type="text"
                              id="mobileResponsivenessIssue"
                              name="mobileResponsivenessIssue"
                              value={feedbackData.mobileResponsivenessIssue}
                              onChange={handleFeedbackInputChange}
                              className="conditional-input"
                              required
                              placeholder="Please explain what you didn't like about mobile responsiveness..."
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Experience Section */}
                    <div className="feedback-section">
                      <h3 className="section-title">User Experience</h3>
                      <p className="section-subtitle">Please rate the following on a scale of 1 to 5 (1 = Poor, 5 = Excellent):</p>

                      <div className="rating-group">
                        <label className="rating-label">4. Overall satisfaction with the website</label>
                        <div className="rating-options">
                          {[1, 2, 3, 4, 5].map(num => (
                            <label key={num} className="radio-label">
                              <input
                                type="radio"
                                name="overallSatisfaction"
                                value={num.toString()}
                                checked={feedbackData.overallSatisfaction === num.toString()}
                                onChange={handleFeedbackInputChange}
                              />
                              <span className="radio-text">{num}</span>
                            </label>
                          ))}
                        </div>
                        {parseInt(feedbackData.overallSatisfaction) < 3 && feedbackData.overallSatisfaction && (
                          <div className="conditional-field">
                            <label htmlFor="overallSatisfactionIssue" className="conditional-label">
                              What didn't you like and why? *
                            </label>
                            <input
                              type="text"
                              id="overallSatisfactionIssue"
                              name="overallSatisfactionIssue"
                              value={feedbackData.overallSatisfactionIssue}
                              onChange={handleFeedbackInputChange}
                              className="conditional-input"
                              required
                              placeholder="Please explain what you didn't like about your overall experience..."
                            />
                          </div>
                        )}
                      </div>

                      <div className="rating-group">
                        <label className="rating-label">5. Ease of completing tasks (e.g., finding information, using tools)</label>
                        <div className="rating-options">
                          {[1, 2, 3, 4, 5].map(num => (
                            <label key={num} className="radio-label">
                              <input
                                type="radio"
                                name="easeOfTasks"
                                value={num.toString()}
                                checked={feedbackData.easeOfTasks === num.toString()}
                                onChange={handleFeedbackInputChange}
                              />
                              <span className="radio-text">{num}</span>
                            </label>
                          ))}
                        </div>
                        {parseInt(feedbackData.easeOfTasks) < 3 && feedbackData.easeOfTasks && (
                          <div className="conditional-field">
                            <label htmlFor="easeOfTasksIssue" className="conditional-label">
                              What didn't you like and why? *
                            </label>
                            <input
                              type="text"
                              id="easeOfTasksIssue"
                              name="easeOfTasksIssue"
                              value={feedbackData.easeOfTasksIssue}
                              onChange={handleFeedbackInputChange}
                              className="conditional-input"
                              required
                              placeholder="Please explain what you didn't like about completing tasks..."
                            />
                          </div>
                        )}
                      </div>

                      <div className="rating-group">
                        <label className="rating-label">6. Quality of services provided</label>
                        <div className="rating-options">
                          {[1, 2, 3, 4, 5].map(num => (
                            <label key={num} className="radio-label">
                              <input
                                type="radio"
                                name="qualityOfServices"
                                value={num.toString()}
                                checked={feedbackData.qualityOfServices === num.toString()}
                                onChange={handleFeedbackInputChange}
                              />
                              <span className="radio-text">{num}</span>
                            </label>
                          ))}
                        </div>
                        {parseInt(feedbackData.qualityOfServices) < 3 && feedbackData.qualityOfServices && (
                          <div className="conditional-field">
                            <label htmlFor="qualityOfServicesIssue" className="conditional-label">
                              What didn't you like and why? *
                            </label>
                            <input
                              type="text"
                              id="qualityOfServicesIssue"
                              name="qualityOfServicesIssue"
                              value={feedbackData.qualityOfServicesIssue}
                              onChange={handleFeedbackInputChange}
                              className="conditional-input"
                              required
                              placeholder="Please explain what you didn't like about the service quality..."
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Suggestions and Legal Needs Section */}
                    <div className="feedback-section">
                      <h3 className="section-title">Suggestions and Legal Needs</h3>

                      <div className="form-group">
                        <label htmlFor="likeMost">7. What do you like most about our website?</label>
                        <textarea
                          id="likeMost"
                          name="likeMost"
                          value={feedbackData.likeMost}
                          onChange={handleFeedbackInputChange}
                          rows={3}
                          className="feedback-textarea"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="improvements">8. What improvements would you suggest for our website?</label>
                        <textarea
                          id="improvements"
                          name="improvements"
                          value={feedbackData.improvements}
                          onChange={handleFeedbackInputChange}
                          rows={3}
                          className="feedback-textarea"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="features">9. Are there any features you would like us to add?</label>
                        <textarea
                          id="features"
                          name="features"
                          value={feedbackData.features}
                          onChange={handleFeedbackInputChange}
                          rows={3}
                          className="feedback-textarea"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="legalChallenges">10. What legal challenges are you facing that our website could help address?</label>
                        <textarea
                          id="legalChallenges"
                          name="legalChallenges"
                          value={feedbackData.legalChallenges}
                          onChange={handleFeedbackInputChange}
                          rows={3}
                          className="feedback-textarea"
                        />
                      </div>
                    </div>

                    {/* Additional Comments Section */}
                    <div className="feedback-section">
                      <h3 className="section-title">Additional Comments</h3>

                      <div className="form-group">
                        <label htmlFor="additionalComments">11. Is there anything else you would like to share?</label>
                        <textarea
                          id="additionalComments"
                          name="additionalComments"
                          value={feedbackData.additionalComments}
                          onChange={handleFeedbackInputChange}
                          rows={3}
                          className="feedback-textarea"
                        />
                      </div>
                    </div>

                    {/* Follow-Up Section */}
                    <div className="feedback-section">
                      <h3 className="section-title">Follow-Up (Optional)</h3>

                      <div className="form-group">
                        <label className="rating-label">12. Would you be willing to be contacted for further feedback?</label>
                        <div className="radio-group">
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="contactWilling"
                              value="yes"
                              checked={feedbackData.contactWilling === 'yes'}
                              onChange={handleFeedbackInputChange}
                            />
                            <span className="radio-text">Yes</span>
                          </label>
                          <label className="radio-label">
                            <input
                              type="radio"
                              name="contactWilling"
                              value="no"
                              checked={feedbackData.contactWilling === 'no'}
                              onChange={handleFeedbackInputChange}
                            />
                            <span className="radio-text">No</span>
                          </label>
                        </div>
                      </div>

                      {feedbackData.contactWilling === 'yes' && (
                        <div className="form-group">
                          <label htmlFor="contactEmail">If yes, please provide your email address:</label>
                          <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            value={feedbackData.contactEmail}
                            onChange={handleFeedbackInputChange}
                            className="feedback-input"
                          />
                        </div>
                      )}
                    </div>

                    {submitError && (
                      <div className="error-message">
                        {submitError}
                      </div>
                    )}

                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </form>
                </div>
              ) : popupType === 'thankyou' ? (
                <div className="popup-content thankyou-content">
                  <h2 className="popup-title">Thank You!</h2>
                  <p className="thankyou-message">
                    {isNotInterested ?
                      "No problem if you are not interested. Thank you for giving your time!" :
                      feedbackSubmitted ?
                      "Thank you for your valuable feedback! Your input helps us improve our platform to better serve your legal needs." :
                      `Thank you for joining our waiting list as a ${userType}! We'll be in touch soon.`
                    }
                  </p>
                  <button className="submit-button" onClick={closePopup}>
                    Close
                  </button>
                </div>
              ) : popupType === 'viewmore' ? (
                <div className="popup-content viewmore-content">
                  <h2 className="popup-title">Explore More</h2>
                  <div className="viewmore-buttons">
                    <button className="viewmore-button" onClick={handleFeedbackClick}>
                      Suggestion & Feedback
                    </button>
                    <button className="viewmore-button" onClick={handleFeaturesClick}>
                      View Features
                    </button>
                  </div>
                </div>
              ) : (
                <div className="popup-content features-content">
                  <h2 className="popup-title">Our Features</h2>
                  <div className="features-list">
                    <div className="feature-item">
                      <h3 className="feature-title">Write Faster, Publish Smarter</h3>
                      <p className="feature-description">
                        Create polished legal blogs in minutes with AI-powered tools.
                      </p>
                    </div>

                    <div className="feature-item">
                      <h3 className="feature-title">Simplify Complex Law</h3>
                      <p className="feature-description">
                        Turn dense legal topics into clear, authoritative articles effortlessly.
                      </p>
                    </div>

                    <div className="feature-item">
                      <h3 className="feature-title">Listen on the Go</h3>
                      <p className="feature-description">
                        Absorb expert insights and updates hands-free with audio summaries.
                      </p>
                    </div>

                    <div className="feature-item">
                      <h3 className="feature-title">Monetize Your Expertise</h3>
                      <p className="feature-description">
                        Build an audience and earn rewards by sharing your legal knowledge.
                      </p>
                    </div>
                  </div>
                  <button className="submit-button" onClick={closePopup}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;

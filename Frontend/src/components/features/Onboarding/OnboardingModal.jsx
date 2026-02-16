import React, { useState, useEffect } from "react";
import "./OnboardingModal.css";

export default function OnboardingModal({ isOpen, onComplete }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    fullName: "",
    country: "",
    currency: "",
    flag: "",
    occupation: "",
    monthlyIncome: 0,
    pocketMoney: 0,
    incomeFrequency: "monthly",
    financialGoals: []
  });

  const [countrySearch, setCountrySearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);

  const occupations = [
    "Student",
    "Employed",
    "Self Employed",
    "Freelancer",
    "Unemployed",
    "Retired",
    "Other"
  ];

  const financialGoalsOptions = [
    "Save for Emergency",
    "Invest in Stocks",
    "Buy a House",
    "Travel the World",
    "Retirement Planning",
    "Pay off Debt",
    "Education Fund",
    "Start a Business"
  ];

  const incomeFrequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Every 2 Weeks" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" }
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/countries/all");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();

        if (!Array.isArray(json)) {
          console.error("Backend did not return array. Got:", json);
          setCountries([]);
          return;
        }

        console.log('✅ Fetched countries:', json.length);

        const formatted = json.map((c) => ({
          name: c.name,
          currency: c.currency,
          flag: c.flag,
        }));

        setCountries(formatted);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setCountries([]);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const finish = async () => {
    setIsLoading(true);
    try {
      await onComplete(data);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (goal) => {
    setData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter(g => g !== goal)
        : [...prev.financialGoals, goal]
    }));
  };

  // Show all countries when no search, or filtered when searching
  const filteredCountries = countrySearch
    ? countries.filter((c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    )
    : countries;

  const isStudent = data.occupation === "Student";

  // Currency symbol mapping
  const getCurrencySymbol = (currency) => {
    const symbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CNY': '¥',
      'AUD': 'A$',
      'CAD': 'C$',
      'CHF': 'CHF',
      'RUB': '₽',
      'BRL': 'R$',
      'ZAR': 'R',
      'KRW': '₩',
      'MXN': '$',
      'SGD': 'S$',
      'HKD': 'HK$',
      'NZD': 'NZ$',
      'SEK': 'kr',
      'NOK': 'kr',
      'DKK': 'kr',
      'PLN': 'zł',
      'TRY': '₺',
      'THB': '฿',
      'IDR': 'Rp',
      'MYR': 'RM',
      'PHP': '₱',
      'AED': 'د.إ',
      'SAR': 'ر.س',
      'EGP': 'E£'
    };
    return symbols[currency] || currency || '$';
  };

  const currencySymbol = getCurrencySymbol(data.currency);

  if (!isOpen) return null;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        {/* Step indicator */}
        <div className="step-indicator">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`step-dot ${step >= num ? "active" : ""}`}
            />
          ))}
        </div>

        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="step-content">
            <h1 className="step-title">Welcome to BudgetUp</h1>
            <p className="step-subtitle">Let's start with your basic details</p>

            <div className="input-group">
              <input
                className="text-input"
                placeholder="Full Name"
                value={data.fullName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </div>

            <div className="input-group">
              <div className="country-selector">
                {data.country ? (
                  <div
                    className="selected-country"
                    onClick={() => {
                      setData((p) => ({
                        ...p,
                        country: "",
                        currency: "",
                        flag: ""
                      }));
                      setCountrySearch("");
                    }}
                  >
                    <span className="country-flag">{data.flag}</span>
                    <span className="country-name">{data.country}</span>
                    <span className="country-currency">({data.currency})</span>
                  </div>
                ) : (
                  <>
                    <input
                      className="text-input"
                      placeholder={countriesLoading ? "Loading countries..." : "Search your country"}
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      disabled={countriesLoading}
                    />
                    {(isSearchFocused || countrySearch) && !countriesLoading && (
                      <div className="country-dropdown">
                        {filteredCountries.length === 0 ? (
                          <div className="dropdown-item no-results">
                            No matches found
                          </div>
                        ) : (
                          filteredCountries.slice(0, 50).map((c) => (
                            <div
                              key={c.name}
                              className="dropdown-item"
                              onClick={() => {
                                setData({
                                  ...data,
                                  country: c.name,
                                  currency: c.currency,
                                  flag: c.flag
                                });
                                setCountrySearch("");
                                setIsSearchFocused(false);
                              }}
                            >
                              <span className="country-flag">{c.flag}</span>
                              <span className="country-info">
                                <span className="country-name">{c.name}</span>
                                <span className="country-currency">{c.currency}</span>
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <button
              className="primary-button"
              disabled={!data.fullName || !data.country}
              onClick={next}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: Occupation */}
        {step === 2 && (
          <div className="step-content">
            <button className="back-button" onClick={back}>
              ← Back
            </button>

            <h1 className="step-title">Your Occupation</h1>
            <p className="step-subtitle">Choose what fits you best</p>

            <div className="options-grid">
              {occupations.map((occupation) => (
                <button
                  key={occupation}
                  className={`option-button ${data.occupation === occupation ? "active" : ""}`}
                  onClick={() =>
                    setData((prev) => ({ ...prev, occupation }))
                  }
                >
                  {occupation}
                </button>
              ))}
            </div>

            <button
              className="primary-button"
              disabled={!data.occupation}
              onClick={next}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 3: Income */}
        {step === 3 && (
          <div className="step-content">
            <button className="back-button" onClick={back}>
              ← Back
            </button>

            <h1 className="step-title">
              {isStudent ? "Pocket Money" : "Income Details"}
            </h1>
            <p className="step-subtitle">
              {isStudent
                ? "How much pocket money do you get monthly?"
                : "What's your monthly income?"}
            </p>

            <div className="income-input-wrapper">
              <span className="currency-symbol">{currencySymbol}</span>
              <input
                type="number"
                className="text-input income-input"
                placeholder="Enter amount"
                value={isStudent ? data.pocketMoney : data.monthlyIncome}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    [isStudent ? 'pocketMoney' : 'monthlyIncome']: parseFloat(e.target.value) || 0
                  }))
                }
              />
            </div>

            {!isStudent && (
              <div className="frequency-section">
                <p className="frequency-label">How often do you get paid?</p>
                <div className="options-grid small">
                  {incomeFrequencies.map((freq) => (
                    <button
                      key={freq.value}
                      className={`option-button small ${data.incomeFrequency === freq.value ? "active" : ""}`}
                      onClick={() =>
                        setData((prev) => ({ ...prev, incomeFrequency: freq.value }))
                      }
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="primary-button"
              disabled={isStudent ? data.pocketMoney <= 0 : data.monthlyIncome <= 0}
              onClick={next}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 4: Financial Goals */}
        {step === 4 && (
          <div className="step-content">
            <button className="back-button" onClick={back}>
              ← Back
            </button>

            <h1 className="step-title">Financial Goals</h1>
            <p className="step-subtitle">What do you want to achieve? (Select multiple)</p>

            <div className="goals-grid">
              {financialGoalsOptions.map((goal) => (
                <button
                  key={goal}
                  className={`goal-button ${data.financialGoals.includes(goal) ? "active" : ""}`}
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </button>
              ))}
            </div>

            <button
              className={`primary-button ${isLoading ? "loading" : ""}`}
              onClick={finish}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
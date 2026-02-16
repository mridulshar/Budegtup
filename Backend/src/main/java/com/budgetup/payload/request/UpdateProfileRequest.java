package com.budgetup.payload.request;

public class UpdateProfileRequest {
    private String name;
    private String fullName;
    private String country;
    private String currency;
    private String flag;
    private String occupation;
    private Double monthlyIncome;
    private Double pocketMoney;
    private String incomeFrequency;

    public UpdateProfileRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getFlag() { return flag; }
    public void setFlag(String flag) { this.flag = flag; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public Double getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(Double monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public Double getPocketMoney() { return pocketMoney; }
    public void setPocketMoney(Double pocketMoney) { this.pocketMoney = pocketMoney; }

    public String getIncomeFrequency() { return incomeFrequency; }
    public void setIncomeFrequency(String incomeFrequency) { this.incomeFrequency = incomeFrequency; }
}

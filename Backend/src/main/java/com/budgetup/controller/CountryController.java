package com.budgetup.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/countries")
public class CountryController {

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, String>>> getAllCountries() {
        List<Map<String, String>> countries = new ArrayList<>();

        countries.add(Map.of("name", "Afghanistan", "currency", "AFN", "flag", "🇦🇫"));
        countries.add(Map.of("name", "Albania", "currency", "ALL", "flag", "🇦🇱"));
        countries.add(Map.of("name", "Algeria", "currency", "DZD", "flag", "🇩🇿"));
        countries.add(Map.of("name", "Argentina", "currency", "ARS", "flag", "🇦🇷"));
        countries.add(Map.of("name", "Australia", "currency", "AUD", "flag", "🇦🇺"));
        countries.add(Map.of("name", "Austria", "currency", "EUR", "flag", "🇦🇹"));
        countries.add(Map.of("name", "Bangladesh", "currency", "BDT", "flag", "🇧🇩"));
        countries.add(Map.of("name", "Belgium", "currency", "EUR", "flag", "🇧🇪"));
        countries.add(Map.of("name", "Brazil", "currency", "BRL", "flag", "🇧🇷"));
        countries.add(Map.of("name", "Canada", "currency", "CAD", "flag", "🇨🇦"));
        countries.add(Map.of("name", "Chile", "currency", "CLP", "flag", "🇨🇱"));
        countries.add(Map.of("name", "China", "currency", "CNY", "flag", "🇨🇳"));
        countries.add(Map.of("name", "Colombia", "currency", "COP", "flag", "🇨🇴"));
        countries.add(Map.of("name", "Czech Republic", "currency", "CZK", "flag", "🇨🇿"));
        countries.add(Map.of("name", "Denmark", "currency", "DKK", "flag", "🇩🇰"));
        countries.add(Map.of("name", "Egypt", "currency", "EGP", "flag", "🇪🇬"));
        countries.add(Map.of("name", "Finland", "currency", "EUR", "flag", "🇫🇮"));
        countries.add(Map.of("name", "France", "currency", "EUR", "flag", "🇫🇷"));
        countries.add(Map.of("name", "Germany", "currency", "EUR", "flag", "🇩🇪"));
        countries.add(Map.of("name", "Ghana", "currency", "GHS", "flag", "🇬🇭"));
        countries.add(Map.of("name", "Greece", "currency", "EUR", "flag", "🇬🇷"));
        countries.add(Map.of("name", "Hong Kong", "currency", "HKD", "flag", "🇭🇰"));
        countries.add(Map.of("name", "Hungary", "currency", "HUF", "flag", "🇭🇺"));
        countries.add(Map.of("name", "India", "currency", "INR", "flag", "🇮🇳"));
        countries.add(Map.of("name", "Indonesia", "currency", "IDR", "flag", "🇮🇩"));
        countries.add(Map.of("name", "Ireland", "currency", "EUR", "flag", "🇮🇪"));
        countries.add(Map.of("name", "Israel", "currency", "ILS", "flag", "🇮🇱"));
        countries.add(Map.of("name", "Italy", "currency", "EUR", "flag", "🇮🇹"));
        countries.add(Map.of("name", "Japan", "currency", "JPY", "flag", "🇯🇵"));
        countries.add(Map.of("name", "Kenya", "currency", "KES", "flag", "🇰🇪"));
        countries.add(Map.of("name", "Malaysia", "currency", "MYR", "flag", "🇲🇾"));
        countries.add(Map.of("name", "Mexico", "currency", "MXN", "flag", "🇲🇽"));
        countries.add(Map.of("name", "Nepal", "currency", "NPR", "flag", "🇳🇵"));
        countries.add(Map.of("name", "Netherlands", "currency", "EUR", "flag", "🇳🇱"));
        countries.add(Map.of("name", "New Zealand", "currency", "NZD", "flag", "🇳🇿"));
        countries.add(Map.of("name", "Nigeria", "currency", "NGN", "flag", "🇳🇬"));
        countries.add(Map.of("name", "Norway", "currency", "NOK", "flag", "🇳🇴"));
        countries.add(Map.of("name", "Pakistan", "currency", "PKR", "flag", "🇵🇰"));
        countries.add(Map.of("name", "Peru", "currency", "PEN", "flag", "🇵🇪"));
        countries.add(Map.of("name", "Philippines", "currency", "PHP", "flag", "🇵🇭"));
        countries.add(Map.of("name", "Poland", "currency", "PLN", "flag", "🇵🇱"));
        countries.add(Map.of("name", "Portugal", "currency", "EUR", "flag", "🇵🇹"));
        countries.add(Map.of("name", "Romania", "currency", "RON", "flag", "🇷🇴"));
        countries.add(Map.of("name", "Russia", "currency", "RUB", "flag", "🇷🇺"));
        countries.add(Map.of("name", "Saudi Arabia", "currency", "SAR", "flag", "🇸🇦"));
        countries.add(Map.of("name", "Singapore", "currency", "SGD", "flag", "🇸🇬"));
        countries.add(Map.of("name", "South Africa", "currency", "ZAR", "flag", "🇿🇦"));
        countries.add(Map.of("name", "South Korea", "currency", "KRW", "flag", "🇰🇷"));
        countries.add(Map.of("name", "Spain", "currency", "EUR", "flag", "🇪🇸"));
        countries.add(Map.of("name", "Sri Lanka", "currency", "LKR", "flag", "🇱🇰"));
        countries.add(Map.of("name", "Sweden", "currency", "SEK", "flag", "🇸🇪"));
        countries.add(Map.of("name", "Switzerland", "currency", "CHF", "flag", "🇨🇭"));
        countries.add(Map.of("name", "Taiwan", "currency", "TWD", "flag", "🇹🇼"));
        countries.add(Map.of("name", "Thailand", "currency", "THB", "flag", "🇹🇭"));
        countries.add(Map.of("name", "Turkey", "currency", "TRY", "flag", "🇹🇷"));
        countries.add(Map.of("name", "Ukraine", "currency", "UAH", "flag", "🇺🇦"));
        countries.add(Map.of("name", "United Arab Emirates", "currency", "AED", "flag", "🇦🇪"));
        countries.add(Map.of("name", "United Kingdom", "currency", "GBP", "flag", "🇬🇧"));
        countries.add(Map.of("name", "United States", "currency", "USD", "flag", "🇺🇸"));
        countries.add(Map.of("name", "Vietnam", "currency", "VND", "flag", "🇻🇳"));

        return ResponseEntity.ok(countries);
    }
}

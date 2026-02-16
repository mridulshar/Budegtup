package com.budgetup.service;

import com.budgetup.model.Transaction;
import com.budgetup.model.Goal;
import com.budgetup.repository.TransactionRepository;
import com.budgetup.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private GoalRepository goalRepository;

    public Map<String, Object> getOverview(String userId, String period) {
        LocalDate start;
        LocalDate end = LocalDate.now();

        switch (period) {
            case "week":
                start = end.minusWeeks(1);
                break;
            case "year":
                start = end.minusYears(1);
                break;
            default: // month
                start = end.withDayOfMonth(1);
                break;
        }

        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, start, end);

        double totalIncome = transactions.stream()
                .filter(t -> "income".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpenses = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        Map<String, Object> overview = new HashMap<>();
        overview.put("totalIncome", totalIncome);
        overview.put("totalExpenses", totalExpenses);
        overview.put("netSavings", totalIncome - totalExpenses);
        overview.put("savingsRate", Math.round(savingsRate));
        overview.put("transactionCount", transactions.size());

        return overview;
    }

    public List<Map<String, Object>> getSpendingTrends(String userId, int months) {
        List<Map<String, Object>> trends = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = months - 1; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);

            List<Transaction> monthTx = transactionRepository
                    .findByUserIdAndDateBetweenOrderByDateDesc(userId, monthStart, monthEnd);

            double income = monthTx.stream()
                    .filter(t -> "income".equals(t.getType()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            double expenses = monthTx.stream()
                    .filter(t -> "expense".equals(t.getType()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            Map<String, Object> trend = new HashMap<>();
            trend.put("month", monthStart.getMonth().toString());
            trend.put("year", monthStart.getYear());
            trend.put("income", income);
            trend.put("expenses", expenses);
            trend.put("savings", income - expenses);

            trends.add(trend);
        }

        return trends;
    }

    public List<Map<String, Object>> getCategoryInsights(String userId, String period) {
        LocalDate start;
        LocalDate end = LocalDate.now();

        switch (period) {
            case "week":
                start = end.minusWeeks(1);
                break;
            case "year":
                start = end.minusYears(1);
                break;
            default:
                start = end.withDayOfMonth(1);
                break;
        }

        List<Transaction> transactions = transactionRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(userId, start, end);

        double totalExpenses = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        Map<String, Double> categoryTotals = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        return categoryTotals.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .map(entry -> {
                    Map<String, Object> insight = new HashMap<>();
                    insight.put("category", entry.getKey());
                    insight.put("amount", entry.getValue());
                    insight.put("percentage", totalExpenses > 0
                            ? Math.round((entry.getValue() / totalExpenses) * 100) : 0);
                    return insight;
                })
                .collect(Collectors.toList());
    }
}

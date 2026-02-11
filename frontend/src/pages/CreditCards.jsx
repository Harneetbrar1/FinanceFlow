import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { CreditCard, Plus, AlertCircle } from "lucide-react";

/**
 * Credit Cards Page
 *
 * Features:
 * - View all credit cards
 * - Track credit card balances
 * - APR and minimum payment info
 * - Payoff calculator integration
 * - Add/Edit/Delete cards
 * - Responsive design
 *
 * TODO: Hook up to backend API
 * TODO: Implement payoff strategies (snowball, avalanche)
 * TODO: Add alerts for high balances
 * TODO: Integration with transactions for credit card payments
 */
export function CreditCards() {
  const [cards] = useState([
    {
      id: 1,
      name: "Capital One",
      balance: 2500,
      apr: 18.99,
      minimumPayment: 75,
      creditLimit: 5000,
    },
    {
      id: 2,
      name: "Chase Sapphire",
      balance: 1200,
      apr: 16.99,
      minimumPayment: 40,
      creditLimit: 10000,
    },
  ]);

  const totalDebt = cards.reduce((sum, card) => sum + card.balance, 0);
  const totalLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
  const utilizationRate = ((totalDebt / totalLimit) * 100).toFixed(1);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        <div className="container-responsive py-8 md:py-12">
          {/* Page Header */}
          <section className="mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Credit Cards
                </h1>
                <p className="text-gray-600">
                  Manage your credit cards and payoff plans
                </p>
              </div>
              <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                <Plus size={20} />
                Add Card
              </button>
            </div>
          </section>

          {/* Debt Summary */}
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <Card
                label="Total Debt"
                value={`$${totalDebt.toLocaleString()}`}
                icon={<CreditCard className="w-5 h-5 text-danger-600" />}
              />
              <Card
                label="Credit Utilization"
                value={`${utilizationRate}%`}
                icon={<AlertCircle className="w-5 h-5 text-warning-600" />}
              />
              <Card
                label="Available Credit"
                value={`$${(totalLimit - totalDebt).toLocaleString()}`}
                icon={<CreditCard className="w-5 h-5 text-success-600" />}
              />
            </div>
          </section>

          {/* Credit Cards List */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cards.map((card) => {
                const utilization = (
                  (card.balance / card.creditLimit) *
                  100
                ).toFixed(1);

                return (
                  <div key={card.id} className="card p-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {card.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {utilization}% utilized
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        ⋮
                      </button>
                    </div>

                    {/* Balance Info */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        ${card.balance.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        of ${card.creditLimit.toLocaleString()} credit limit
                      </p>
                    </div>

                    {/* Card Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          APR
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {card.apr}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Min. Payment
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${card.minimumPayment}
                        </p>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            utilization > 75
                              ? "bg-danger-600"
                              : utilization > 50
                                ? "bg-warning-600"
                                : "bg-success-600"
                          }`}
                          style={{ width: `${utilization}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {cards.length === 0 && (
              <div className="card p-12">
                <div className="text-center">
                  <CreditCard
                    size={48}
                    className="mx-auto mb-4 text-gray-400"
                  />
                  <p className="text-lg font-medium text-gray-900">
                    No credit cards added
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Add your credit cards to start tracking debt
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CreditCards;

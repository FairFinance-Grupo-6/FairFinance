import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet } from "lucide-react";

interface Transaction {
  id: string;
  payee: string;
  amount: number;
  date: string;
  category: string;
}

const data = [
  { name: "Jan", income: 2400, expenses: 1398 },
  { name: "Feb", income: 1398, expenses: 2800 },
  { name: "Mar", income: 9800, expenses: 2908 },
  { name: "Apr", income: 3908, expenses: 4800 },
  { name: "May", income: 4800, expenses: 3800 },
  { name: "Jun", income: 3800, expenses: 4300 },
];

const transactions: Transaction[] = [
  { id: "1", payee: "Apple", amount: -999, date: "2023-06-01", category: "Electronics" },
  { id: "2", payee: "Salary", amount: 5000, date: "2023-06-02", category: "Income" },
  { id: "3", payee: "Grocery Store", amount: -150, date: "2023-06-03", category: "Food" },
  { id: "4", payee: "Gas Station", amount: -50, date: "2023-06-04", category: "Transportation" },
  { id: "5", payee: "Restaurant", amount: -80, date: "2023-06-05", category: "Dining" },
];

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Finance Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance Card */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Balance</div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">$12,345</div>
          <p className="text-xs text-muted-foreground">+2% from last month</p>
        </div>

        {/* Income Card */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Income</div>
            <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">$5,000</div>
          <p className="text-xs text-muted-foreground">+10% from last month</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Expenses</div>
            <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">$3,500</div>
          <p className="text-xs text-muted-foreground">+5% from last month</p>
        </div>

        {/* Savings Card */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Savings</div>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">$1,500</div>
          <p className="text-xs text-muted-foreground">+20% from last month</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Recent Transactions Table */}
        <div className="col-span-3 bg-white p-6 shadow-md rounded-md">
          <div className="text-lg font-medium mb-4">Recent Transactions</div>
          <p className="text-xs text-muted-foreground">You made 5 transactions this month.</p>
          <table className="min-w-full mt-4">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Payee</th>
                <th className="py-2 px-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2 px-4">{transaction.payee}</td>
                  <td className={`py-2 px-4 ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

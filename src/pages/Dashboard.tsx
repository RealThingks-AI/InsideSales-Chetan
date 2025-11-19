import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Customers",
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Active Deals",
      value: "87",
      change: "+8%",
      icon: TrendingUp,
      color: "text-success",
    },
    {
      title: "Revenue",
      value: "$124,500",
      change: "+23%",
      icon: DollarSign,
      color: "text-warning",
    },
    {
      title: "Activities",
      value: "342",
      change: "+5%",
      icon: Activity,
      color: "text-accent",
    },
  ];

  const recentDeals = [
    { company: "Acme Corp", value: "$50,000", stage: "Negotiation", contact: "John Doe" },
    { company: "TechStart", value: "$25,000", stage: "Proposal", contact: "Jane Smith" },
    { company: "Global Inc", value: "$75,000", stage: "Qualified", contact: "Mike Johnson" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success mt-1">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Deals */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDeals.map((deal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{deal.company}</h3>
                  <p className="text-sm text-muted-foreground">{deal.contact}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{deal.value}</p>
                  <p className="text-sm text-muted-foreground">{deal.stage}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

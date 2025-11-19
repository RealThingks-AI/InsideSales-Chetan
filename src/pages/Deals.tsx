import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Deal {
  id: number;
  title: string;
  company: string;
  value: number;
  stage: "Lead" | "Qualified" | "Proposal" | "Negotiation" | "Closed";
}

const Deals = () => {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([
    { id: 1, title: "Enterprise Package", company: "Acme Corp", value: 50000, stage: "Negotiation" },
    { id: 2, title: "Starter Plan", company: "TechStart", value: 25000, stage: "Proposal" },
    { id: 3, title: "Premium Service", company: "Global Inc", value: 75000, stage: "Qualified" },
  ]);

  const [newDeal, setNewDeal] = useState({
    title: "",
    company: "",
    value: "",
    stage: "Lead" as Deal["stage"],
  });

  const stages: Deal["stage"][] = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];

  const handleAddDeal = () => {
    if (!newDeal.title || !newDeal.company || !newDeal.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const deal: Deal = {
      id: deals.length + 1,
      title: newDeal.title,
      company: newDeal.company,
      value: parseFloat(newDeal.value),
      stage: newDeal.stage,
    };

    setDeals([...deals, deal]);
    setNewDeal({ title: "", company: "", value: "", stage: "Lead" });
    
    toast({
      title: "Success",
      description: "Deal added successfully",
    });
  };

  const getDealsByStage = (stage: Deal["stage"]) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deals Pipeline</h1>
          <p className="text-muted-foreground mt-1">Track and manage your sales opportunities</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Deal Title *</Label>
                <Input
                  id="title"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="Enterprise Package"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <Label htmlFor="value">Value (USD) *</Label>
                <Input
                  id="value"
                  type="number"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={newDeal.stage}
                  onValueChange={(value) => setNewDeal({ ...newDeal, stage: value as Deal["stage"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddDeal} className="w-full">
                Add Deal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stages.map((stage) => (
          <Card key={stage} className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">{stage}</CardTitle>
              <p className="text-xs text-muted-foreground">{getDealsByStage(stage).length} deals</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {getDealsByStage(stage).map((deal) => (
                <div
                  key={deal.id}
                  className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
                >
                  <h3 className="font-semibold text-sm text-foreground mb-1">{deal.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{deal.company}</p>
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-sm">{formatCurrency(deal.value)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Deals;

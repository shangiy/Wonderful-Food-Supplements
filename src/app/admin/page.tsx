"use client";

import { products } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, Edit, Trash, BarChart3, Package, ShoppingBag, 
  Users, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Search, Bell, Layers, Settings, Activity, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/firebase";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  const { user, loading } = useUser();

  // Protect Admin Route
  if (!loading && (!user || user.email !== "admin@backend.com")) {
    redirect("/account");
  }

  const stats = [
    { title: "Total Revenue", value: "KES 412,500", trend: "+12.5%", isUp: true, icon: BarChart3 },
    { title: "Active Orders", value: "48", trend: "+8.2%", isUp: true, icon: ShoppingBag },
    { title: "Avg. Basket Value", value: "KES 8,500", trend: "-2.4%", isUp: false, icon: TrendingUp },
    { title: "New Customers", value: "124", trend: "+18.3%", isUp: true, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* 2026 Modern Header */}
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              Studio Vision <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">2026.v4</Badge>
            </h1>
            <p className="text-muted-foreground font-medium">Hyper-efficient operational control center for Wonderful Food Supplements</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Command search..." className="w-[300px] pl-10 h-11 bg-white border-none shadow-sm rounded-xl focus-visible:ring-primary" />
            </div>
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-white shadow-sm hover:bg-secondary">
              <Bell className="h-5 w-5" />
            </Button>
            <Button className="h-11 rounded-xl px-6 gap-2 shadow-lg shadow-primary/20 bg-primary font-bold transition-all hover:scale-[1.02]" asChild>
              <Link href="/admin/products/new">
                <Plus className="h-5 w-5" />
                Deploy Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</CardTitle>
                <div className="p-2 rounded-xl bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-2">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${stat.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {stat.isUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {stat.trend}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last cycle</span>
                </div>
              </CardContent>
              {/* Decorative accent */}
              <div className={`h-1 w-full mt-auto ${stat.isUp ? 'bg-primary' : 'bg-destructive'} opacity-10 group-hover:opacity-100 transition-opacity`} />
            </Card>
          ))}
        </div>

        {/* Main Grid: Management & Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Inventory Control Table */}
          <Card className="xl:col-span-2 border-none shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Nexus Inventory</CardTitle>
                <CardDescription>Direct management of global product supply</CardDescription>
              </div>
              <Button variant="outline" className="rounded-xl h-10 gap-2">
                <Activity className="h-4 w-4" />
                Stock Pulse
              </Button>
            </CardHeader>
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-none">
                  <TableHead className="font-bold">Product Blueprint</TableHead>
                  <TableHead className="font-bold">Module</TableHead>
                  <TableHead className="font-bold">Value</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Execution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 6).map((product) => (
                  <TableRow key={product.id} className="hover:bg-secondary/20 transition-colors border-b-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary">
                          {product.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize bg-secondary text-primary border-none">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold">KES {product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium">Optimal</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-red-50 hover:text-red-500"><Trash className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-secondary/10 text-center">
              <Button variant="link" className="text-primary font-bold">View full inventory list ({products.length})</Button>
            </div>
          </Card>

          {/* Sidebar Insights */}
          <div className="space-y-8">
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl overflow-hidden relative">
              <Sparkles className="absolute top-4 right-4 h-12 w-12 opacity-10" />
              <CardHeader>
                <CardTitle>AI Prediction</CardTitle>
                <CardDescription className="text-primary-foreground/70">Powered by Genkit Predictive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-sm font-medium">Expected 15% increase in "Vitamins" demand over the next 14 days. We suggest boosting Tre-en-en stock levels by 200 units.</p>
                </div>
                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12">
                  Auto-Restock Now
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">System Health</CardTitle>
                <CardDescription>Server and database performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Database Latency</span>
                    <span className="text-green-500 font-bold">14ms</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[98%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Storage Efficiency</span>
                    <span className="font-bold">64%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[64%]" />
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl gap-2 mt-4">
                  <Layers className="h-4 w-4" />
                  System logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
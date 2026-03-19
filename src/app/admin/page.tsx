
"use client";

import { useMemo, useState, useEffect } from "react";
import { products as initialProducts } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, Edit, Trash, BarChart3, Package, ShoppingBag, 
  Users, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Search, Bell, Layers, Activity, Sparkles, ShieldCheck, 
  Lock, CheckCircle2, XCircle, AlertCircle, UserPlus, UserMinus,
  Monitor, Smartphone, Cpu, Globe, Database, Zap
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore, useDoc, useCollection } from "@/firebase";
import { redirect } from "next/navigation";
import { doc, collection, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [deviceInfo, setDeviceInfo] = useState("Detecting hardware...");

  // Real-time Device Detection
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) setDeviceInfo("Mobile Platform");
    else if (/tablet/i.test(ua)) setDeviceInfo("Tablet Device");
    else setDeviceInfo("Desktop Workstation");
  }, []);

  // Fetch role from Firestore
  const userDocRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  // Fetch all users for Admin User Management
  const usersQuery = useMemo(() => {
    if (!db || profile?.role !== 'admin') return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db, profile?.role]);
  
  const { data: allUsers, loading: usersLoading } = useCollection(usersQuery);

  // Protect Admin/Staff Route
  useEffect(() => {
    if (!userLoading && !profileLoading) {
      if (!user) {
        redirect("/account");
      }
      const role = profile?.role;
      if (role !== "admin" && role !== "staff") {
        redirect("/account");
      }
    }
  }, [user, userLoading, profileLoading, profile?.role]);

  if (userLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Activity className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const isAdmin = profile?.role === "admin";

  const handleUpdateStatus = (productId: string, newStatus: any) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
    toast({
      title: "Inventory Updated",
      description: `Asset status shifted to ${newStatus.replace('-', ' ')}`,
    });
  };

  const handlePromoteToStaff = async (targetUser: any) => {
    if (!db || !isAdmin) return;
    try {
      await updateDoc(doc(db, "users", targetUser.uid), { role: "staff" });
      toast({ title: "Privilege Escalated", description: `${targetUser.displayName} promoted to Staff.` });
    } catch (e) {
      toast({ title: "Error", description: "Security override failed.", variant: "destructive" });
    }
  };

  const handleDemoteToCustomer = async (targetUser: any) => {
    if (!db || !isAdmin) return;
    try {
      await updateDoc(doc(db, "users", targetUser.uid), { role: "customer" });
      toast({ title: "Privilege Revoked", description: `${targetUser.displayName} demoted to Customer.` });
    } catch (e) {
      toast({ title: "Error", description: "Security override failed.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Futuristic Vision Control Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-secondary/20">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-slate-900">
              VISION CONTROL <Badge className="bg-primary/10 text-primary border-none text-[10px] px-3 py-1 rounded-full">v2026.LOGISTICS</Badge>
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Authority: {profile?.role?.toUpperCase()}</span>
              <span className="flex items-center gap-1.5 text-blue-500"><Globe className="h-4 w-4" /> Node: Nairobi_Main_Hub</span>
              <span className="flex items-center gap-1.5 text-orange-500"><Zap className="h-4 w-4" /> Uptime: 99.98%</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Card className="flex items-center gap-4 px-6 py-4 border-none bg-secondary/30 rounded-[1.5rem] shadow-none w-full sm:w-auto">
              <div className="p-3 rounded-2xl bg-white text-primary shadow-sm">
                {deviceInfo.includes("Desktop") ? <Monitor className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Hardware Platform</p>
                <p className="text-sm font-black text-slate-800">{deviceInfo}</p>
              </div>
            </Card>
            {isAdmin && (
              <Button className="h-14 rounded-2xl px-8 gap-2 shadow-xl shadow-primary/20 bg-primary font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform w-full sm:w-auto" asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-5 w-5" />
                  Deploy New Asset
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Core Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Content: Inventory Management */}
          <div className="xl:col-span-2 space-y-8">
            <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-10 pb-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black tracking-tighter">Inventory Core</CardTitle>
                    <CardDescription className="text-sm font-medium">Manage and monitor global product health and availability</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-secondary/20">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="h-10 px-5 rounded-2xl font-black border-secondary text-slate-700">{products.length} ASSETS REGISTERED</Badge>
                  </div>
                </div>
              </CardHeader>
              <div className="px-2 pb-6">
                <Table>
                  <TableHeader className="bg-secondary/10 border-none">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="font-black h-16 pl-10 text-xs uppercase tracking-widest text-slate-500">Asset Identity</TableHead>
                      <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Classification</TableHead>
                      <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Unit Value (KES)</TableHead>
                      <TableHead className="font-black text-xs uppercase tracking-widest text-slate-500">Logic State</TableHead>
                      {isAdmin && <TableHead className="text-right pr-10 font-black text-xs uppercase tracking-widest text-slate-500">Operations</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-secondary/5 transition-colors border-b-secondary/20 group">
                        <TableCell className="pl-10 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                              {product.name.charAt(0)}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-black text-sm text-slate-800">{product.name}</p>
                              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">ID: {product.id.padStart(4, '0')}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize text-[10px] px-4 py-1 font-black bg-secondary/40 border-none tracking-wider">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="font-black text-sm text-slate-700">{product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={product.status || 'optimal'} 
                            onValueChange={(val) => handleUpdateStatus(product.id, val)}
                          >
                            <SelectTrigger className="h-11 w-[160px] text-[11px] font-black uppercase tracking-widest rounded-xl bg-secondary/20 border-none focus:ring-primary shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white">
                              <SelectItem value="optimal" className="rounded-xl">
                                <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-green-500" /> Optimal</div>
                              </SelectItem>
                              <SelectItem value="out-of-stock" className="rounded-xl">
                                <div className="flex items-center gap-3"><AlertCircle className="h-4 w-4 text-orange-500" /> Stock Out</div>
                              </SelectItem>
                              <SelectItem value="discontinued" className="rounded-xl">
                                <div className="flex items-center gap-3"><XCircle className="h-4 w-4 text-red-500" /> EOL</div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right pr-10 space-x-3">
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors border border-transparent hover:border-primary/20"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-destructive/5 hover:text-destructive transition-colors border border-transparent hover:border-destructive/20"><Trash className="h-4 w-4" /></Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Sidebar: User Nexus & AI Insights */}
          <div className="space-y-8">
            {isAdmin && (
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3 text-primary">
                        <Users className="h-6 w-6" />
                        User Nexus
                      </CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Privilege Allocation Unit</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-5">
                  {usersLoading ? (
                    <div className="flex justify-center p-12"><Activity className="h-10 w-10 animate-spin text-primary" /></div>
                  ) : (
                    <div className="space-y-4">
                      {allUsers?.filter(u => u.uid !== user?.uid).slice(0, 6).map((u: any) => (
                        <div key={u.uid} className="flex items-center justify-between p-5 bg-secondary/10 rounded-2xl border border-secondary/20 group hover:border-primary/30 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-sm font-black text-primary shadow-sm border border-secondary/30 group-hover:scale-105 transition-transform">
                              {u.displayName?.charAt(0) || u.email?.charAt(0)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-slate-800 truncate max-w-[140px]">{u.displayName || "Unknown User"}</p>
                              <Badge className="text-[9px] h-5 px-2 py-0 font-black uppercase tracking-widest bg-primary text-white border-none shadow-sm">{u.role}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {u.role === 'customer' ? (
                              <Button variant="secondary" size="icon" className="h-10 w-10 text-primary hover:bg-primary hover:text-white rounded-xl shadow-none transition-all" title="Grant Staff Privileges" onClick={() => handlePromoteToStaff(u)}>
                                <UserPlus className="h-5 w-5" />
                              </Button>
                            ) : u.role === 'staff' ? (
                              <Button variant="secondary" size="icon" className="h-10 w-10 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl shadow-none transition-all" title="Revoke to Customer" onClick={() => handleDemoteToCustomer(u)}>
                                <UserMinus className="h-5 w-5" />
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="w-full rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase h-14 border-secondary/50 hover:bg-secondary transition-all">View Global Directory</Button>
                </CardContent>
              </Card>
            )}

            {/* AI Insights - Futuristic Metrics */}
            <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-[2.5rem] overflow-hidden relative p-10 group">
              <Sparkles className="absolute -top-6 -right-6 h-32 w-32 opacity-5 text-accent group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black mb-1 flex items-center gap-3">
                    <Cpu className="h-7 w-7 text-accent animate-pulse" />
                    Neural Insights
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                    Vision Core predicts an 18.4% increase in <span className="text-accent">Immune Support</span> demand over the next cycle.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    <span>System Integrity</span>
                    <span className="text-accent">Nominal</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_10px_rgba(142,204,76,0.5)]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Response</p>
                    <p className="text-lg font-black text-accent">14ms</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Accuracy</p>
                    <p className="text-lg font-black text-primary">99.2%</p>
                  </div>
                </div>

                <Button className="w-full bg-white text-slate-900 hover:bg-accent hover:text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl h-14 shadow-xl shadow-accent/10">
                  Run Global Optimization
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

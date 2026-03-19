
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
  Monitor, Smartphone, Cpu, Globe
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

  // Device Detection
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

  // Protect Admin Route
  if (!userLoading && !profileLoading) {
    if (!user) {
      redirect("/account");
    }
    const role = profile?.role;
    if (role !== "admin" && role !== "staff") {
      redirect("/account");
    }
  }

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
      description: `Status changed to ${newStatus.replace('-', ' ')}`,
    });
  };

  const handlePromoteToStaff = async (targetUser: any) => {
    if (!db || !isAdmin) return;
    try {
      await updateDoc(doc(db, "users", targetUser.uid), { role: "staff" });
      toast({ title: "Privilege Escalated", description: `${targetUser.displayName} promoted to Staff.` });
    } catch (e) {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    }
  };

  const handleDemoteToCustomer = async (targetUser: any) => {
    if (!db || !isAdmin) return;
    try {
      await updateDoc(doc(db, "users", targetUser.uid), { role: "customer" });
      toast({ title: "Privilege Revoked", description: `${targetUser.displayName} demoted to Customer.` });
    } catch (e) {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Futuristic Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-secondary/20">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-slate-900">
              VISION CONTROL <Badge className="bg-primary/10 text-primary border-none text-[10px] px-2 py-0">2026.PRO</Badge>
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Root Access: {profile?.role}</span>
              <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-blue-500" /> Server: Nairobi-East</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="flex items-center gap-4 px-6 py-3 border-none bg-secondary/30 rounded-2xl shadow-none">
              <div className="p-2 rounded-xl bg-white text-primary">
                {deviceInfo.includes("Desktop") ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Interface</p>
                <p className="text-sm font-black">{deviceInfo}</p>
              </div>
            </Card>
            {isAdmin && (
              <Button className="h-12 rounded-2xl px-6 gap-2 shadow-xl shadow-primary/20 bg-primary font-bold hover:scale-[1.02] transition-transform" asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-5 w-5" />
                  New Asset
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Inventory Management - Primary Column */}
          <Card className="xl:col-span-2 border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Inventory Core</CardTitle>
                  <CardDescription>Manage global asset availability and catalog status</CardDescription>
                </div>
                <Badge variant="outline" className="h-7 px-4 rounded-full font-bold border-secondary">{products.length} Items Total</Badge>
              </div>
            </CardHeader>
            <div className="p-2">
              <Table>
                <TableHeader className="bg-secondary/20 border-none">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="font-bold h-14 pl-8">Product Identity</TableHead>
                    <TableHead className="font-bold">Classification</TableHead>
                    <TableHead className="font-bold">Unit Price</TableHead>
                    <TableHead className="font-bold">Logic Status</TableHead>
                    {isAdmin && <TableHead className="text-right pr-8 font-bold">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-secondary/5 transition-colors border-b-secondary/30 group">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            {product.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">UID: #00{product.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-[10px] px-3 font-bold bg-secondary/40 border-none">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-black text-sm text-slate-700">KES {product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={product.status || 'optimal'} 
                          onValueChange={(val) => handleUpdateStatus(product.id, val)}
                        >
                          <SelectTrigger className="h-9 w-[150px] text-[11px] font-bold rounded-xl bg-secondary/20 border-none focus:ring-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                            <SelectItem value="optimal">
                              <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Optimal</div>
                            </SelectItem>
                            <SelectItem value="out-of-stock">
                              <div className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-orange-500" /> Stock Out</div>
                            </SelectItem>
                            <SelectItem value="discontinued">
                              <div className="flex items-center gap-2"><XCircle className="h-3 w-3 text-red-500" /> End Of Life</div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right pr-8 space-x-2">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5"><Edit className="h-4 w-4 text-muted-foreground" /></Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/5"><Trash className="h-4 w-4 text-destructive/50" /></Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* User Nexus - Sidebar Column */}
          <div className="space-y-8">
            {isAdmin && (
              <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        User Nexus
                      </CardTitle>
                      <CardDescription>Manage privilege escalation and roles</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-4">
                  {usersLoading ? (
                    <div className="flex justify-center p-8"><Activity className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : (
                    <div className="space-y-4">
                      {allUsers?.filter(u => u.uid !== user?.uid).slice(0, 8).map((u: any) => (
                        <div key={u.uid} className="flex items-center justify-between p-4 bg-secondary/10 rounded-2xl border border-secondary/20 hover:border-primary/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-black text-primary shadow-sm">
                              {u.displayName?.charAt(0) || u.email?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold truncate max-w-[140px]">{u.displayName || "Unidentified User"}</p>
                              <Badge className="text-[9px] h-4 py-0 font-black uppercase bg-primary text-white border-none">{u.role}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {u.role === 'customer' ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg" title="Escalate to Staff" onClick={() => handlePromoteToStaff(u)}>
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            ) : u.role === 'staff' ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:bg-orange-50 rounded-lg" title="Revoke to Customer" onClick={() => handleDemoteToCustomer(u)}>
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="w-full rounded-2xl text-[11px] font-black tracking-widest uppercase h-12 border-secondary hover:bg-secondary">Access Global Directory</Button>
                </CardContent>
              </Card>
            )}

            {/* AI Insights Card */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-primary text-white rounded-[2.5rem] overflow-hidden relative p-8">
              <Sparkles className="absolute top-6 right-6 h-14 w-14 opacity-10" />
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <Cpu className="h-6 w-6 text-accent" />
                    AI Core
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">Vision intelligence predicts an 18% surge in demand for Immune Support assets in the next 72 hours.</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50">
                    <span>System Integrity</span>
                    <span>99.9%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[99.9%] bg-accent rounded-full" />
                  </div>
                </div>

                <Button className="w-full bg-white text-slate-900 hover:bg-accent hover:text-slate-900 font-bold rounded-2xl h-14 text-sm">
                  Run Optimization
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

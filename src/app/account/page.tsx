
"use client";

import { useState, useMemo, useEffect } from "react";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingBag, Settings, LogOut, User as UserIcon, Loader2, Heart, Key, ShieldCheck, Box, Sparkles, Activity, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AccountPage() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Profile data from Firestore
  const userDocRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);
  
  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "staff" | "admin">("customer");

  const isAdmin = profile?.role === "admin";
  const isStaff = profile?.role === "staff";
  const isCustomer = profile?.role === "customer" || !profile?.role;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Authorized", description: "Identity verified. Session initiated." });
    } catch (error: any) {
      toast({ 
        title: "Access Denied", 
        description: "Invalid credentials provided.", 
        variant: "destructive" 
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setIsAuthLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      await updateProfile(newUser, { displayName: name });
      
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: newUser.email,
        displayName: name,
        role: selectedRole,
        createdAt: serverTimestamp()
      });

      toast({ title: "Account Initialized", description: `Subject registered as ${selectedRole.toUpperCase()}.` });
    } catch (error: any) {
      toast({ title: "Operation Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Session Terminated", description: "Identity logs cleared." });
  };

  if (userLoading || (user && profileLoading)) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <Activity className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-10 bg-secondary/30 rounded-[1.25rem] h-14 p-1.5">
            <TabsTrigger value="login" className="rounded-xl font-black uppercase text-[10px] tracking-widest">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl font-black uppercase text-[10px] tracking-widest">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="text-center pt-12">
                <CardTitle className="text-3xl font-black tracking-tighter">System Access</CardTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-2">Identity Verification Required</p>
              </CardHeader>
              <CardContent className="p-12 pt-8">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-black uppercase text-[10px] tracking-widest ml-1 text-slate-500">Email Address</Label>
                    <Input id="email" type="email" placeholder="admin@backend.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-16 rounded-[1.5rem] bg-secondary/40 border-none focus-visible:ring-primary font-bold px-6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" title="Try: backendPass01" className="font-black uppercase text-[10px] tracking-widest ml-1 text-slate-500">Access Key</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-16 rounded-[1.5rem] bg-secondary/40 border-none focus-visible:ring-primary font-bold px-6" />
                  </div>
                  <Button type="submit" className="w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30" disabled={isAuthLoading}>
                    {isAuthLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    Initialize Session
                  </Button>
                </form>
                <div className="mt-10 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <p className="text-[9px] text-center text-primary font-black uppercase tracking-[0.4em] mb-4">Master Authority Keys</p>
                  <div className="flex justify-center">
                    <Button variant="ghost" className="h-10 text-[9px] font-black underline tracking-widest" onClick={() => { setEmail("admin@backend.com"); setPassword("backendPass01"); }}>Pre-fill Admin Auth</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
              <CardHeader className="text-center pt-12">
                <CardTitle className="text-3xl font-black tracking-tighter">New Registration</CardTitle>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-2">Initialize Profile Node</p>
              </CardHeader>
              <CardContent className="p-12 pt-8">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-black uppercase text-[10px] tracking-widest ml-1">Display Identity</Label>
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-16 rounded-[1.5rem] bg-secondary/40 border-none px-6 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="font-black uppercase text-[10px] tracking-widest ml-1">Email Node</Label>
                    <Input id="email-signup" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-16 rounded-[1.5rem] bg-secondary/40 border-none px-6 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="font-black uppercase text-[10px] tracking-widest ml-1">Secret Key</Label>
                    <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-16 rounded-[1.5rem] bg-secondary/40 border-none px-6 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black uppercase text-[10px] tracking-widest ml-1">Authority Level</Label>
                    <Select value={selectedRole} onValueChange={(val: any) => setSelectedRole(val)}>
                      <SelectTrigger className="h-16 rounded-[1.5rem] bg-secondary/40 border-none px-6 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="customer">Customer (Wellness)</SelectItem>
                        <SelectItem value="staff">Staff (Logistics)</SelectItem>
                        <SelectItem value="admin">Admin (Full Control)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30" disabled={isAuthLoading}>
                    Create Node
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Identity Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <Card className="border-none shadow-sm rounded-[3rem] overflow-hidden p-10 text-center bg-white border border-secondary/20">
              <Avatar className="h-32 w-32 mb-8 border-8 border-secondary/30 mx-auto shadow-inner">
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-black">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="font-black text-3xl tracking-tighter text-slate-900">{user.displayName || "Unidentified"}</h2>
                {(isAdmin || isStaff) && <ShieldCheck className="h-6 w-6 text-primary" />}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-10">
                Level: <span className="text-primary">{profile?.role?.toUpperCase() || 'CUSTOMER'}</span>
              </p>
              
              <div className="space-y-3">
                {/* Shopping features hidden for Admins */}
                {!isAdmin && (
                  <>
                    <Button variant="secondary" className="w-full justify-start gap-4 h-14 rounded-2xl bg-secondary/50 border-none font-bold px-6 group" asChild>
                      <Link href="/cart">
                        <ShoppingBag className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" /> 
                        Cart Hub
                      </Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-4 h-14 rounded-2xl bg-secondary/50 border-none font-bold px-6 group" asChild>
                      <Link href="/wishlist">
                        <Heart className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" /> 
                        Saved Assets
                      </Link>
                    </Button>
                  </>
                )}
                
                {(isAdmin || isStaff) && (
                  <Button variant="default" className="w-full justify-start gap-4 h-14 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase text-[10px] tracking-widest px-6" asChild>
                    <Link href="/admin"><Box className="h-5 w-5" /> Vision Dashboard</Link>
                  </Button>
                )}
              </div>
              
              <Button variant="outline" className="w-full mt-12 rounded-2xl h-14 border-secondary text-slate-500 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" /> Terminate Session
              </Button>
            </Card>
          </div>

          {/* Contextual Nexus Dashboard Area */}
          <div className="flex-grow space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-slate-900 text-white border-none rounded-[3rem] shadow-2xl p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
                  <ShieldCheck className="h-24 w-24" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">Security Integrity</p>
                <h3 className="text-4xl font-black tracking-tighter">{isAdmin ? "ROOT ACCESS" : "AUTHORIZED"}</h3>
              </Card>
              <Card className="bg-primary text-white border-none rounded-[3rem] shadow-2xl p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
                  <Sparkles className="h-24 w-24" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-3">Community Status</p>
                <h3 className="text-4xl font-black tracking-tighter">{isAdmin ? "SYSTEM CORE" : "PRIME MEMBER"}</h3>
              </Card>
            </div>

            {isAdmin ? (
              <Card className="border-none shadow-sm rounded-[3rem] p-12 bg-white border-2 border-dashed border-secondary/50 text-center space-y-8">
                <div className="h-20 w-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/10">
                  <ShieldAlert className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter">Authority Interface Active</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">Identity confirmed as root administrator. Your interface is optimized for system logistics and user management. Shopping modules are currently deactivated for this profile level.</p>
                </div>
                <Button asChild className="rounded-[1.5rem] px-16 h-16 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20">
                  <Link href="/admin">Initialize Core Dashboard</Link>
                </Button>
              </Card>
            ) : (
              <Card className="border-none shadow-sm rounded-[3rem] p-12 bg-white border-2 border-dashed border-secondary/50 text-center space-y-8">
                <div className="h-20 w-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/10">
                  <ShoppingBag className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tighter">Wellness Portal</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">Access your personalized health roadmap. Track orders, manage your saves, and continue your journey towards optimal vitality.</p>
                </div>
                <Button asChild className="rounded-[1.5rem] px-16 h-16 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20">
                  <Link href="/products">Explore Catalog</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

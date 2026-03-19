
"use client";

import { useState, useMemo } from "react";
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
import { ShoppingBag, Settings, LogOut, User as UserIcon, Loader2, Heart, Key, ShieldCheck, Box } from "lucide-react";
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
      toast({ title: "Welcome back!", description: "Access granted." });
    } catch (error: any) {
      toast({ 
        title: "Sign in failed", 
        description: "Invalid credentials.", 
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

      toast({ title: "Account created!", description: `Profile registered as ${selectedRole}.` });
    } catch (error: any) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed out", description: "Session ended." });
  };

  if (userLoading || (user && profileLoading)) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/50 rounded-2xl h-12">
            <TabsTrigger value="login" className="rounded-xl">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-xl">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="text-center pt-10">
                <CardTitle className="text-2xl font-black tracking-tight">System Login</CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold ml-2">Email</Label>
                    <Input id="email" type="email" placeholder="admin@backend.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 rounded-2xl bg-secondary/30 border-none focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" title="Try: backendPass01" className="font-bold ml-2">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-14 rounded-2xl bg-secondary/30 border-none focus-visible:ring-primary" />
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20" disabled={isAuthLoading}>
                    {isAuthLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Enter Portal
                  </Button>
                </form>
                <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[10px] text-center text-primary font-bold uppercase tracking-widest">Master Credentials</p>
                  <div className="mt-2 flex justify-center gap-4">
                    <Button variant="ghost" className="h-8 text-[10px] font-black underline" onClick={() => { setEmail("admin@backend.com"); setPassword("backendPass01"); }}>Admin Auth</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="text-center pt-10">
                <CardTitle className="text-2xl font-black tracking-tight">Join Nexus</CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-bold ml-2">Display Name</Label>
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-14 rounded-2xl bg-secondary/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="font-bold ml-2">Email</Label>
                    <Input id="email-signup" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 rounded-2xl bg-secondary/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup" className="font-bold ml-2">Access Key</Label>
                    <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-14 rounded-2xl bg-secondary/30 border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-2">Access Level</Label>
                    <Select value={selectedRole} onValueChange={(val: any) => setSelectedRole(val)}>
                      <SelectTrigger className="h-14 rounded-2xl bg-secondary/30 border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="customer">Customer (Shopping)</SelectItem>
                        <SelectItem value="staff">Staff (Inventory)</SelectItem>
                        <SelectItem value="admin">Admin (System)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20" disabled={isAuthLoading}>
                    Create Account
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Action Sidebar */}
          <div className="w-full md:w-80 space-y-4">
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden p-8 text-center bg-white">
              <Avatar className="h-24 w-24 mb-6 border-4 border-primary/10 mx-auto">
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-black">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="font-black text-2xl tracking-tighter">{user.displayName || "Member"}</h2>
                {(isAdmin || isStaff) && <ShieldCheck className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">
                Access Level: <span className="text-primary">{profile?.role || 'customer'}</span>
              </p>
              
              <div className="space-y-3">
                {/* Shopping features hidden for Admins */}
                {!isAdmin && (
                  <>
                    <Button variant="secondary" className="w-full justify-start gap-3 h-14 rounded-2xl bg-secondary/40 border-none font-bold" asChild>
                      <Link href="/cart"><ShoppingBag className="h-5 w-5 text-primary" /> My Cart</Link>
                    </Button>
                    <Button variant="secondary" className="w-full justify-start gap-3 h-14 rounded-2xl bg-secondary/40 border-none font-bold" asChild>
                      <Link href="/wishlist"><Heart className="h-5 w-5 text-primary" /> My Wishlist</Link>
                    </Button>
                  </>
                )}
                
                {(isAdmin || isStaff) && (
                  <Button variant="default" className="w-full justify-start gap-3 h-14 rounded-2xl shadow-lg shadow-primary/20 font-bold" asChild>
                    <Link href="/admin"><Box className="h-5 w-5" /> Admin Panel</Link>
                  </Button>
                )}
              </div>
              
              <Button variant="outline" className="w-full mt-10 rounded-2xl h-14 border-secondary font-black uppercase text-[10px] tracking-widest" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </Card>
          </div>

          {/* Contextual Dashboard Area */}
          <div className="flex-grow space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-slate-900 text-white border-none rounded-[2rem] shadow-xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-20 w-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Security Status</p>
                <h3 className="text-3xl font-black">{isAdmin ? "SYSTEM ROOT" : "AUTHORIZED"}</h3>
              </Card>
              <Card className="bg-primary text-white border-none rounded-[2rem] shadow-xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-20 w-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Member Tier</p>
                <h3 className="text-3xl font-black">{isAdmin ? "CORE ADMIN" : "GOLD MEMBER"}</h3>
              </Card>
            </div>

            {isAdmin ? (
              <Card className="border-none shadow-sm rounded-[2rem] p-10 bg-white border-2 border-dashed border-secondary text-center">
                <Box className="h-14 w-14 text-primary/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black mb-3">System Control Active</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">As a root administrator, your interface is focused on inventory logistics and user nexus management. Shopping features are restricted for administrative accounts.</p>
                <Button asChild className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs">
                  <Link href="/admin">Enter Core Dashboard</Link>
                </Button>
              </Card>
            ) : (
              <Card className="border-none shadow-sm rounded-[2rem] p-10 bg-white border-2 border-dashed border-secondary text-center">
                <ShoppingBag className="h-14 w-14 text-primary/20 mx-auto mb-6" />
                <h3 className="text-2xl font-black mb-3">Member Portal</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">Manage your wellness journey from here. View your orders, wishlist, and track your healthy progress.</p>
                <Button asChild className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

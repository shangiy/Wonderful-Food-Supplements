
"use client";

import { useState, useMemo } from "react";
import { useUser, useAuth, useFirestore, useDoc } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingBag, Settings, LogOut, User as UserIcon, Loader2, Heart, Key, ShieldCheck, CreditCard } from "lucide-react";
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

  const fillAdminCreds = () => {
    setEmail("admin@backend.com");
    setPassword("backendPass01");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Successfully signed in." });
    } catch (error: any) {
      toast({ 
        title: "Sign in failed", 
        description: "Invalid credentials. Please register first.", 
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

      toast({ title: "Account created!", description: `Welcome as a ${selectedRole}!` });
    } catch (error: any) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast({ title: "Signed out", description: "Come back soon!" });
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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isAuthLoading}>
                    {isAuthLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign In
                  </Button>
                </form>
                <Button variant="ghost" className="w-full mt-4 text-xs gap-2" onClick={fillAdminCreds}>
                  <Key className="h-3 w-3" />
                  Fill Admin Credentials
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">Join Community</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <Select value={selectedRole} onValueChange={(val: any) => setSelectedRole(val)}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isAuthLoading}>
                    Register Account
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
          {/* Sidebar */}
          <div className="w-full md:w-72 space-y-4">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden p-6 text-center">
              <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10 mx-auto">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="font-bold text-xl">{user.displayName || "Member"}</h2>
                {(profile?.role === 'admin' || profile?.role === 'staff') && (
                  <ShieldCheck className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">
                {profile?.role || 'customer'}
              </p>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3 h-11 rounded-xl" asChild>
                  <Link href="/cart"><ShoppingBag className="h-5 w-5 text-primary" /> My Cart</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-11 rounded-xl" asChild>
                  <Link href="/wishlist"><Heart className="h-5 w-5 text-primary" /> My Wishlist</Link>
                </Button>
                {(profile?.role === "admin" || profile?.role === "staff") && (
                  <Button variant="secondary" className="w-full justify-start gap-3 h-11 rounded-xl bg-primary/10 text-primary hover:bg-primary/20" asChild>
                    <Link href="/admin"><ShieldCheck className="h-5 w-5" /> Admin Panel</Link>
                  </Button>
                )}
              </div>
              <Button variant="outline" className="w-full mt-8 rounded-xl h-11" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </Card>
          </div>

          {/* Main Area */}
          <div className="flex-grow space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-primary text-primary-foreground border-none rounded-3xl shadow-sm p-6">
                <p className="text-sm opacity-70 mb-1">Loyalty Status</p>
                <h3 className="text-3xl font-black">Gold Member</h3>
              </Card>
              <Card className="bg-accent text-accent-foreground border-none rounded-3xl shadow-sm p-6">
                <p className="text-sm opacity-70 mb-1">Rewards Points</p>
                <h3 className="text-3xl font-black">1,250</h3>
              </Card>
            </div>

            <Card className="border-none shadow-sm rounded-3xl p-8 text-center border-2 border-dashed">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">My Orders</h3>
              <p className="text-muted-foreground mb-6 text-sm">You have no active orders at the moment. Explore our supplements to get started.</p>
              <Button asChild className="rounded-full px-10 h-12 font-bold">
                <Link href="/products">Shop Now</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
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
import { ShoppingBag, Settings, LogOut, User as UserIcon, Loader2, Heart, Facebook, Github, Key, ShieldCheck } from "lucide-react";
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
  const userDocRef = user ? doc(db, "users", user.uid) : null;
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
        description: error.code === 'auth/invalid-credential' ? "User not found or wrong password. Did you register first?" : error.message, 
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
      
      // Save role and profile to Firestore
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

  const handleSocialSignIn = async (providerName: 'google' | 'facebook' | 'github') => {
    if (!auth || !db) return;
    setIsAuthLoading(true);
    try {
      let provider;
      switch (providerName) {
        case 'google': provider = new GoogleAuthProvider(); break;
        case 'facebook': provider = new FacebookAuthProvider(); break;
        case 'github': provider = new GithubAuthProvider(); break;
      }
      const result = await signInWithPopup(auth, provider);
      
      // For social login, ensure profile exists with default 'customer' role
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        role: "customer",
        createdAt: serverTimestamp()
      }, { merge: true });

      toast({ title: "Success!", description: `Signed in with ${providerName}.` });
    } catch (error: any) {
      toast({ title: "Auth failed", description: error.message, variant: "destructive" });
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
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
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
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-xs text-muted-foreground gap-2 hover:text-primary transition-colors"
                  onClick={fillAdminCreds}
                >
                  <Key className="h-3 w-3" />
                  Fill Demo Admin Credentials
                </Button>

                <div className="space-y-4 w-full mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="w-full h-12" onClick={() => handleSocialSignIn('google')} disabled={isAuthLoading}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </Button>
                    <Button variant="outline" className="w-full h-12" onClick={() => handleSocialSignIn('facebook')} disabled={isAuthLoading}>
                      <Facebook className="h-5 w-5 text-[#1877F2] fill-current" />
                    </Button>
                    <Button variant="outline" className="w-full h-12" onClick={() => handleSocialSignIn('github')} disabled={isAuthLoading}>
                      <Github className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>Join our wellness community today.</CardDescription>
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
                    <Label>Account Type (For Demo)</Label>
                    <Select value={selectedRole} onValueChange={(val: any) => setSelectedRole(val)}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer (Standard)</SelectItem>
                        <SelectItem value="staff">Staff (Inventory & Orders)</SelectItem>
                        <SelectItem value="admin">Admin (Full Access)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isAuthLoading}>
                    {isAuthLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create {selectedRole} Account
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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-4 border-primary/10">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-xl">{user.displayName || "User"}</h2>
                  {(profile?.role === 'admin' || profile?.role === 'staff') && (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  {profile?.role || 'customer'}
                </p>
                <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
                <Button variant="outline" className="w-full justify-start gap-2 rounded-xl h-12" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
            
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl" asChild>
                <Link href="/account">
                  <UserIcon className="h-5 w-5 text-primary" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl" asChild>
                <Link href="/cart">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  My Cart
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12 rounded-xl" asChild>
                <Link href="/wishlist">
                  <Heart className="h-5 w-5 text-primary" />
                  My Wishlist
                </Link>
              </Button>
              {(profile?.role === "admin" || profile?.role === "staff") && (
                <Button variant="secondary" className="w-full justify-start gap-3 h-12 rounded-xl bg-accent/20 text-accent-foreground hover:bg-accent/30" asChild>
                  <Link href="/admin">
                    <Key className="h-5 w-5" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="bg-primary text-primary-foreground border-none rounded-3xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Privilege Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold capitalize">{profile?.role || "Customer"}</div>
                  <p className="text-xs opacity-70 mt-1">
                    {profile?.role === 'admin' ? "Full control enabled" : profile?.role === 'staff' ? "Operational access enabled" : "Standard member access"}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-accent text-accent-foreground border-none rounded-3xl shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Loyalty Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Standard</div>
                  <p className="text-xs opacity-70 mt-1">Welcome to Wonderful Food supplements.</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle>Member Dashboard</CardTitle>
                <CardDescription>Manage your orders, profile, and preferences from here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-8 border-2 border-dashed rounded-3xl text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-bold mb-2">No active orders</h3>
                  <p className="text-muted-foreground mb-6">Ready to start your wellness journey?</p>
                  <Button asChild className="rounded-full px-8 h-12">
                    <Link href="/products">Shop Supplements</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

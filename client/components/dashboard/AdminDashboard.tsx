"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Edit, Trash2, UserPlus, BookOpen, Users } from "lucide-react";

// Import admin API functions
import { 
  User, 
  Course, 
  AdminStats as Stats,
  getAllUsersAlt as getAllUsers, 
  getAllCoursesAdmin as getAllCourses,
  createUser,
  deleteUser,
  updateCourseFeaturedStatus,
  createCourse,
  updateCourse,
  deleteCourse
} from "@/api/admin";

export function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    activeStudents: 0,
    activeTutors: 0,
    completedCourses: 0,
    featuredCourses: 0
  });
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    featured: false
  });
  
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [editCourseData, setEditCourseData] = useState({
    _id: "",
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    featured: false
  });

  useEffect(() => {
    // Check if user is logged in and is an admin
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "admin") {
      // Redirect non-admin users to appropriate dashboard
      if (user.role === "tutor" || user.role === "both") {
        router.push("/tutor-dashboard");
      } else {
        router.push("/dashboard");
      }
      
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      });
      return;
    }

    // Fetch real data using admin API functions
    const fetchData = async () => {
      try {
        // Fetch users
        const usersData = await getAllUsers();
        setUsers(usersData);

        // Fetch courses
        const coursesData = await getAllCourses();
        setCourses(coursesData);

        // No need to load lessons data anymore since we removed that tab

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, [user, router, toast]);
  
  // Update stats whenever users or courses change
  useEffect(() => {
    const activeStudents = users.filter(user => user.role === 'student' || user.role === 'both').length;
    const activeTutors = users.filter(user => user.role === 'tutor' || user.role === 'both').length;
    const featuredCourses = courses.filter(course => course.featured).length;
    
    setStats({
      totalUsers: users.length,
      totalCourses: courses.length,
      activeStudents,
      activeTutors,
      completedCourses: 0, // This would need to be calculated from enrollment data
      featuredCourses
    });
  }, [users, courses]);

  // Handle user search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle course search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.instructor && course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle adding a new user
  const handleAddUser = async () => {
    try {
      // Use the admin API to create a user
      const newUser = await createUser({
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        role: newUserData.role as "student" | "tutor" | "both" | "admin",
      });
      
      setUsers([...users, newUser]);
      setIsAddUserDialogOpen(false);
      setNewUserData({
        name: "",
        email: "",
        password: "",
        role: "student",
      });

      toast({
        title: "User Added",
        description: `${newUser.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add user',
        variant: "destructive",
      });
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    try {
      // Use the admin API to delete a user
      await deleteUser(userId);
      
      setUsers(users.filter((user) => user._id !== userId));
      toast({
        title: "User Deleted",
        description: "The user has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete user',
        variant: "destructive",
      });
    }
  };

  // Handle featuring/unfeaturing a course
  const handleToggleFeature = async (courseId: string) => {
    try {
      const course = courses.find(c => c._id === courseId);
      if (!course) return;

      // Use the admin API to update course featured status
      const updatedCourse = await updateCourseFeaturedStatus(courseId, !course.featured);
      
      setCourses(
        courses.map((course) =>
          course._id === courseId
            ? { ...course, featured: updatedCourse.featured }
            : course
        )
      );
      
      // Update stats when featuring/unfeaturing courses
      const featuredCourses = courses.filter(course => course.featured).length;
      setStats({
        ...stats,
        featuredCourses: featuredCourses
      });
      
      toast({
        title: "Course Updated",
        description: "The course featured status has been updated.",
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update course',
        variant: "destructive",
      });
    }
  };

  // Handle adding a new course
  const handleAddCourse = async () => {
    try {
      // Use the admin API to create a course
      const newCourse = await createCourse({
        title: newCourseData.title,
        description: newCourseData.description,
        category: newCourseData.category,
        level: newCourseData.level,
        price: newCourseData.price,
        featured: newCourseData.featured
      });
      
      setCourses([...courses, newCourse]);
      setIsAddCourseDialogOpen(false);
      setNewCourseData({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        price: 0,
        featured: false
      });

      toast({
        title: "Course Added",
        description: `${newCourse.title} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add course',
        variant: "destructive",
      });
    }
  };

  // Handle deleting a course
  const handleDeleteCourse = async (courseId: string) => {
    try {
      // Use the admin API to delete a course
      await deleteCourse(courseId);
      
      setCourses(courses.filter((course) => course._id !== courseId));
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete course',
        variant: "destructive",
      });
    }
  };

  // Handle editing a course
  const handleEditCourse = (course: Course) => {
    setEditCourseData({
      _id: course._id,
      title: course.title,
      description: course.description || "",
      category: course.category || "",
      level: course.level || "beginner",
      price: course.price || 0,
      featured: course.featured || false
    });
    setIsEditCourseDialogOpen(true);
  };

  // Handle submitting course edits
  const handleUpdateCourse = async () => {
    try {
      // Use the admin API to update the course
      const updatedCourse = await updateCourse(editCourseData._id, {
        title: editCourseData.title,
        description: editCourseData.description,
        category: editCourseData.category,
        level: editCourseData.level,
        price: editCourseData.price,
        featured: editCourseData.featured
      });
      
      setCourses(courses.map(course => 
        course._id === editCourseData._id ? updatedCourse : course
      ));
      setIsEditCourseDialogOpen(false);

      toast({
        title: "Course Updated",
        description: `${updatedCourse.title} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update course',
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeStudents} students, {stats.activeTutors} tutors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.featuredCourses} featured courses
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="w-[250px] pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new user account in the system.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={newUserData.name}
                            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={newUserData.password}
                            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={newUserData.role}
                            onValueChange={(value) => setNewUserData({ ...newUserData, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="tutor">Tutor</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddUser}>Add User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <CardDescription>
                Manage users, their roles, and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Enrolled Courses</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === "admin" 
                              ? "destructive" 
                              : user.role === "tutor" 
                                ? "outline" 
                                : user.role === "both" 
                                  ? "secondary" 
                                  : "default"
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.enrolledCourses ? user.enrolledCourses.length : 0}</TableCell>
                        <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No users found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search courses..."
                      className="w-[250px] pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                          Create a new course in the system.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="course-title">Title</Label>
                          <Input
                            id="course-title"
                            value={newCourseData.title}
                            onChange={(e) => setNewCourseData({ ...newCourseData, title: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="course-description">Description</Label>
                          <Input
                            id="course-description"
                            value={newCourseData.description}
                            onChange={(e) => setNewCourseData({ ...newCourseData, description: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="course-category">Category</Label>
                          <Input
                            id="course-category"
                            value={newCourseData.category}
                            onChange={(e) => setNewCourseData({ ...newCourseData, category: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="course-level">Level</Label>
                          <Select
                            value={newCourseData.level}
                            onValueChange={(value) => setNewCourseData({ ...newCourseData, level: value })}
                          >
                            <SelectTrigger id="course-level">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="course-price">Price ($)</Label>
                          <Input
                            id="course-price"
                            type="number"
                            value={newCourseData.price.toString()}
                            onChange={(e) => setNewCourseData({ ...newCourseData, price: Number(e.target.value) })}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="course-featured"
                            checked={newCourseData.featured}
                            onChange={(e) => setNewCourseData({ ...newCourseData, featured: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="course-featured">Featured Course</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddCourseDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddCourse}>Add Course</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <CardDescription>
                Manage courses, instructors, and content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.category}</TableCell>
                        <TableCell>{course.students || 0}</TableCell>
                        <TableCell>{course.instructor ? course.instructor.name : 'N/A'}</TableCell>
                        <TableCell>${course.price || 0}</TableCell>
                        <TableCell>
                          <Badge variant={course.featured ? "default" : "outline"}>
                            {course.featured ? "Featured" : "Not Featured"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleFeature(course._id)}
                            >
                              {course.featured ? "Unfeature" : "Feature"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCourse(course._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No courses found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Course Dialog */}
      <Dialog open={isEditCourseDialogOpen} onOpenChange={setIsEditCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-course-title">Title</Label>
              <Input
                id="edit-course-title"
                value={editCourseData.title}
                onChange={(e) => setEditCourseData({ ...editCourseData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-course-description">Description</Label>
              <Input
                id="edit-course-description"
                value={editCourseData.description}
                onChange={(e) => setEditCourseData({ ...editCourseData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-course-category">Category</Label>
              <Input
                id="edit-course-category"
                value={editCourseData.category}
                onChange={(e) => setEditCourseData({ ...editCourseData, category: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-course-level">Level</Label>
              <Select
                value={editCourseData.level}
                onValueChange={(value) => setEditCourseData({ ...editCourseData, level: value })}
              >
                <SelectTrigger id="edit-course-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-course-price">Price ($)</Label>
              <Input
                id="edit-course-price"
                type="number"
                value={editCourseData.price.toString()}
                onChange={(e) => setEditCourseData({ ...editCourseData, price: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="edit-course-featured"
                checked={editCourseData.featured}
                onChange={(e) => setEditCourseData({ ...editCourseData, featured: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="edit-course-featured">Featured Course</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCourseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCourse}>Update Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

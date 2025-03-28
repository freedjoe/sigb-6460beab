
import { useEffect, useState } from "react";
import { 
  Dashboard, 
  DashboardHeader, 
  DashboardSection 
} from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FilePlus, SearchIcon, FileEdit, Trash2, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data
interface Budget {
  id: string;
  year: number;
  ministryId: string;
  ministryName: string;
  totalAmount: number;
  allocatedAmount: number;
  status: "draft" | "pending" | "approved" | "rejected";
}

const mockBudgets: Budget[] = [
  {
    id: "b1",
    year: 2023,
    ministryId: "m1",
    ministryName: "Ministère de l'Éducation",
    totalAmount: 1250000000,
    allocatedAmount: 980000000,
    status: "approved"
  },
  {
    id: "b2",
    year: 2023,
    ministryId: "m2",
    ministryName: "Ministère de la Santé",
    totalAmount: 980000000,
    allocatedAmount: 750000000,
    status: "approved"
  },
  {
    id: "b3",
    year: 2023,
    ministryId: "m3",
    ministryName: "Ministère des Transports",
    totalAmount: 750000000,
    allocatedAmount: 420000000,
    status: "approved"
  },
  {
    id: "b4",
    year: 2023,
    ministryId: "m4",
    ministryName: "Ministère de l'Agriculture",
    totalAmount: 620000000,
    allocatedAmount: 510000000,
    status: "approved"
  },
  {
    id: "b5",
    year: 2023,
    ministryId: "m5",
    ministryName: "Ministère de la Défense",
    totalAmount: 890000000,
    allocatedAmount: 740000000,
    status: "approved"
  },
  {
    id: "b6",
    year: 2023,
    ministryId: "m6",
    ministryName: "Ministère de la Justice",
    totalAmount: 410000000,
    allocatedAmount: 380000000,
    status: "pending"
  },
  {
    id: "b7",
    year: 2023,
    ministryId: "m7",
    ministryName: "Ministère des Affaires Étrangères",
    totalAmount: 350000000,
    allocatedAmount: 210000000,
    status: "pending"
  },
  {
    id: "b8",
    year: 2024,
    ministryId: "m1",
    ministryName: "Ministère de l'Éducation",
    totalAmount: 1350000000,
    allocatedAmount: 0,
    status: "draft"
  },
  {
    id: "b9",
    year: 2024,
    ministryId: "m2",
    ministryName: "Ministère de la Santé",
    totalAmount: 1050000000,
    allocatedAmount: 0,
    status: "draft"
  }
];

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modal states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [newBudgetData, setNewBudgetData] = useState<Partial<Budget>>({
    year: new Date().getFullYear(),
    status: "draft",
    totalAmount: 0,
    allocatedAmount: 0
  });

  useEffect(() => {
    // Simulate API call
    const loadBudgets = () => {
      setBudgets(mockBudgets);
      setFilteredBudgets(mockBudgets);
    };
    
    loadBudgets();
  }, []);

  useEffect(() => {
    let result = budgets;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(budget => 
        budget.ministryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by year
    if (yearFilter && yearFilter !== "all") {
      result = result.filter(budget => 
        budget.year.toString() === yearFilter
      );
    }
    
    // Filter by status
    if (statusFilter && statusFilter !== "all") {
      result = result.filter(budget => 
        budget.status === statusFilter
      );
    }
    
    setFilteredBudgets(result);
  }, [budgets, searchTerm, yearFilter, statusFilter]);

  const getStatusBadge = (status: Budget["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Brouillon</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-400">En attente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-400">Approuvé</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-400">Rejeté</Badge>;
      default:
        return null;
    }
  };

  // Modal handlers
  const handleOpenAddDialog = () => {
    setNewBudgetData({
      year: new Date().getFullYear(),
      status: "draft",
      totalAmount: 0,
      allocatedAmount: 0
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (budget: Budget) => {
    setCurrentBudget(budget);
    setNewBudgetData({
      year: budget.year,
      ministryId: budget.ministryId,
      ministryName: budget.ministryName,
      totalAmount: budget.totalAmount,
      allocatedAmount: budget.allocatedAmount,
      status: budget.status
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenViewDialog = (budget: Budget) => {
    setCurrentBudget(budget);
    setIsViewDialogOpen(true);
  };

  const handleOpenDeleteDialog = (budget: Budget) => {
    setCurrentBudget(budget);
    setIsDeleteDialogOpen(true);
  };

  // CRUD operations
  const handleAddBudget = () => {
    if (!newBudgetData.ministryName || !newBudgetData.year) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    const newBudget: Budget = {
      id: `b${budgets.length + 10}`,
      year: newBudgetData.year || new Date().getFullYear(),
      ministryId: newBudgetData.ministryId || `m${budgets.length + 10}`,
      ministryName: newBudgetData.ministryName || "",
      totalAmount: newBudgetData.totalAmount || 0,
      allocatedAmount: 0,
      status: "draft"
    };

    setBudgets([...budgets, newBudget]);
    setIsAddDialogOpen(false);
    toast({
      title: "Budget ajouté",
      description: `Le budget pour "${newBudget.ministryName}" a été ajouté avec succès.`,
    });
  };

  const handleEditBudget = () => {
    if (!currentBudget) return;

    if (!newBudgetData.ministryName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    const updatedBudgets = budgets.map(budget => 
      budget.id === currentBudget.id 
        ? { 
            ...budget,
            year: newBudgetData.year || budget.year,
            ministryName: newBudgetData.ministryName || budget.ministryName,
            totalAmount: newBudgetData.totalAmount || budget.totalAmount,
            allocatedAmount: newBudgetData.allocatedAmount || budget.allocatedAmount,
            status: newBudgetData.status || budget.status
          } 
        : budget
    );

    setBudgets(updatedBudgets);
    setIsEditDialogOpen(false);
    toast({
      title: "Budget modifié",
      description: `Le budget pour "${currentBudget.ministryName}" a été modifié avec succès.`,
    });
  };

  const handleDeleteBudget = () => {
    if (!currentBudget) return;

    const updatedBudgets = budgets.filter(budget => budget.id !== currentBudget.id);
    setBudgets(updatedBudgets);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Budget supprimé",
      description: `Le budget pour "${currentBudget.ministryName}" a été supprimé avec succès.`,
    });
  };

  // Mock ministries for select dropdown
  const ministries = [
    "Ministère de l'Éducation",
    "Ministère de la Santé",
    "Ministère des Transports",
    "Ministère de l'Agriculture",
    "Ministère de la Défense",
    "Ministère de la Justice",
    "Ministère des Affaires Étrangères",
    "Ministère des Finances",
    "Ministère de l'Intérieur"
  ];

  return (
    <Dashboard>
      <DashboardHeader 
        title="Gestion des Budgets" 
        description="Créez, modifiez et suivez les budgets des ministères"
      >
        <Button className="shadow-subtle" onClick={handleOpenAddDialog}>
          <FilePlus className="mr-2 h-4 w-4" />
          Nouveau budget
        </Button>
      </DashboardHeader>

      <DashboardSection>
        <Card className="budget-card">
          <CardHeader>
            <CardTitle>Filtrer les budgets</CardTitle>
            <CardDescription>
              Utilisez les filtres ci-dessous pour affiner votre recherche
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ministère..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </DashboardSection>

      <DashboardSection>
        <Card className="budget-card">
          <CardHeader>
            <CardTitle>Liste des Budgets</CardTitle>
            <CardDescription>
              {filteredBudgets.length} budget{filteredBudgets.length !== 1 ? 's' : ''} trouvé{filteredBudgets.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ministère</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead className="text-right">Montant Total</TableHead>
                    <TableHead className="text-right">Montant Alloué</TableHead>
                    <TableHead className="text-right">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.length > 0 ? (
                    filteredBudgets.map((budget) => (
                      <TableRow 
                        key={budget.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">{budget.ministryName}</TableCell>
                        <TableCell>{budget.year}</TableCell>
                        <TableCell className="text-right">{formatCurrency(budget.totalAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(budget.allocatedAmount)}</TableCell>
                        <TableCell className="text-right">{getStatusBadge(budget.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenViewDialog(budget)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditDialog(budget)}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDeleteDialog(budget)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun budget trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </DashboardSection>

      {/* Add Budget Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau budget</DialogTitle>
            <DialogDescription>
              Complétez le formulaire pour créer un nouveau budget.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ministry" className="text-right">
                Ministère
              </Label>
              <Select
                value={newBudgetData.ministryName}
                onValueChange={(value) =>
                  setNewBudgetData({ ...newBudgetData, ministryName: value, ministryId: `m${Math.floor(Math.random() * 100)}` })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un ministère" />
                </SelectTrigger>
                <SelectContent>
                  {ministries.map((ministry) => (
                    <SelectItem key={ministry} value={ministry}>
                      {ministry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Année
              </Label>
              <Select
                value={newBudgetData.year?.toString()}
                onValueChange={(value) =>
                  setNewBudgetData({ ...newBudgetData, year: parseInt(value) })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Montant Total
              </Label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={newBudgetData.totalAmount || ""}
                onChange={(e) =>
                  setNewBudgetData({
                    ...newBudgetData,
                    totalAmount: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleAddBudget}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le budget</DialogTitle>
            <DialogDescription>
              Modifiez les détails du budget.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-ministry" className="text-right">
                Ministère
              </Label>
              <Select
                value={newBudgetData.ministryName}
                onValueChange={(value) =>
                  setNewBudgetData({ ...newBudgetData, ministryName: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un ministère" />
                </SelectTrigger>
                <SelectContent>
                  {ministries.map((ministry) => (
                    <SelectItem key={ministry} value={ministry}>
                      {ministry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-year" className="text-right">
                Année
              </Label>
              <Select
                value={newBudgetData.year?.toString()}
                onValueChange={(value) =>
                  setNewBudgetData({ ...newBudgetData, year: parseInt(value) })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner une année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-amount" className="text-right">
                Montant Total
              </Label>
              <Input
                id="edit-amount"
                type="number"
                className="col-span-3"
                value={newBudgetData.totalAmount || ""}
                onChange={(e) =>
                  setNewBudgetData({
                    ...newBudgetData,
                    totalAmount: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-allocated" className="text-right">
                Montant Alloué
              </Label>
              <Input
                id="edit-allocated"
                type="number"
                className="col-span-3"
                value={newBudgetData.allocatedAmount || ""}
                onChange={(e) =>
                  setNewBudgetData({
                    ...newBudgetData,
                    allocatedAmount: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Statut
              </Label>
              <Select
                value={newBudgetData.status}
                onValueChange={(value) =>
                  setNewBudgetData({ 
                    ...newBudgetData, 
                    status: value as "draft" | "pending" | "approved" | "rejected" 
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleEditBudget}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Budget Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du budget</DialogTitle>
          </DialogHeader>
          {currentBudget && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Ministère:</div>
                <div>{currentBudget.ministryName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Année:</div>
                <div>{currentBudget.year}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Montant Total:</div>
                <div>{formatCurrency(currentBudget.totalAmount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Montant Alloué:</div>
                <div>{formatCurrency(currentBudget.allocatedAmount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">Statut:</div>
                <div>{getStatusBadge(currentBudget.status)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">ID:</div>
                <div>{currentBudget.id}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Budget Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce budget? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {currentBudget && (
            <div className="py-4">
              <p>
                <strong>Ministère:</strong> {currentBudget.ministryName}
              </p>
              <p>
                <strong>Année:</strong> {currentBudget.year}
              </p>
              <p>
                <strong>Montant Total:</strong> {formatCurrency(currentBudget.totalAmount)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteBudget}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
}

function confirmDelete(name) {
    var del = confirm("Do u want to delete this " + name + " phone ?");
    if (del){
        return true;
    } else {
        return false;
    }
}
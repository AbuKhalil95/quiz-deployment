<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;
    protected $fillable = ['name'];


    public function users()
{
    return $this->belongsToMany(User::class, 'role_user'); // specify pivot table
}

public function permissions()
{
    return $this->belongsToMany(permissions::class, 'permission_role'); // specify pivot table
}
}

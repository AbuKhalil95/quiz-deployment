<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission_Role extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionRoleFactory> */
    use HasFactory;


    protected $table = 'permission_role';

    protected $fillable = ['role_id', 'permission_id'];


    public function permission()
    {
        return $this->belongsTo(permissions::class, 'permission_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}

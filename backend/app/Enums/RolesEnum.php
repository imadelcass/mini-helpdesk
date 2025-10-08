<?php

namespace App\Enums;

enum RolesEnum: int
{
    case USER = 1;
    case AGENT = 2;
    case ADMIN = 3;
}
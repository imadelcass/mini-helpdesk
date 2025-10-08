<?php

namespace App\Enums;

enum TicketStatusEnum: int
{
    case OPEN = 1;
    case CLOSED = 2;
    case RESOLVED = 3;
}
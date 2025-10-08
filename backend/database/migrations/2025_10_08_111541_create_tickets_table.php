<?php

use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique()->index();
            $table->text('description');
            $table->unsignedTinyInteger('priority')->index();
            $table->unsignedTinyInteger('status')->index();
            $table->foreignIdFor(User::class)->constrained();
            $table->foreignIdFor(TicketCategory::class)->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};

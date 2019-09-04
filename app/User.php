<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'firstname', 'lastname', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get Top 10 Users grouped by time across all projects
     * @param string $dateFrom
     * @param string $dateTo
     * @return \Illuminate\Support\Collection
     */
    public static function getTopUsersByTime($dateFrom = '', $dateTo = '', $userId = null, $projectId = null)
    {
        $query = DB::table('timelogs AS t')
            ->join('users AS u', 'u.id', '=', 't.user_id')
            ->join('projects AS p', 'p.id', '=', 't.project_id')
            ->select(DB::raw('SUM(t.hours) as sum_hours'), DB::raw("CONCAT_WS(' ', u.firstname, u.lastname) as name"), 'u.id')
            ->groupBy('u.id')
            ->orderBy('sum_hours', 'desc')
            ->limit(10);

        if ($dateFrom) {
            $query->where('t.date', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->where('t.date', '<=', $dateTo);
        }
        if ($userId) {
            $query->where('u.id', '=', $userId);
        }
        if ($projectId) {
            $query->where('p.id', '=', $projectId);
        }

        $result = $query->get();

        return $result;
    }
}

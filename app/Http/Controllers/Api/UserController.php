<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $users = new User();

            if (isset($request->orderBy)) {
                $orderDir = isset($request->orderDir) ? $request->orderDir : 'asc';
                $users = $users->orderBy($request->orderBy, $orderDir);
            }

            $users = $users->paginate(10);

            return response()->json($users);

        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function topUsersByTime(Request $request)
    {
        try {
            $dateFrom = '';
            $dateTo = '';
            $userId = null;
            $projectId = null;

            if (isset($request->dateFrom)) {
                $dateFrom = $request->dateFrom;
            }
            if (isset($request->dateTo)) {
                $dateTo = $request->dateTo;
            }
            if (isset($request->userId)) {
                $userId = $request->userId;
            }
            if (isset($request->projectId)) {
                $projectId = $request->projectId;
            }

            $result = User::getTopUsersByTime($dateFrom, $dateTo, $userId, $projectId);

            return response()->json($result);
        } catch(\Exception $e){
            return response()->json($e->getMessage());
        }
    }
}

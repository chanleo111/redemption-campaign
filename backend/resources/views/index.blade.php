@extends('layouts.app')

@section('content')
    <div class="container">
        <h1>Coupon Management</h1>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if (session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Quota</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($coupons as $coupon)
                    <tr>
                        <td>{{ $coupon['coupon_id'] }}</td>
                        <td>{{ $coupon['name'] }}</td>
                        <td>{{ $coupon['points'] }}</td>
                        <td>{{ $coupon['quota'] }}</td>
                        <td>{{ $coupon['status'] }}</td>
                        <td>
                            <button class="btn btn-primary" data-toggle="modal" data-target="#editModal{{ $coupon['coupon_id'] }}">Edit</button>
                            <!-- Edit Modal -->
                            <div class="modal fade" id="editModal{{ $coupon['coupon_id'] }}" tabindex="-1" role="dialog">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Edit Coupon {{ $coupon['coupon_id'] }}</h5>
                                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <form action="{{ route('cms.update', $coupon['coupon_id']) }}" method="POST">
                                            @csrf
                                            @method('PUT')
                                            <div class="modal-body">
                                                <div class="form-group">
                                                    <label for="quota">Quota</label>
                                                    <input type="number" name="quota" class="form-control" value="{{ $coupon['quota'] }}" required>
                                                </div>
                                                <div class="form-group">
                                                    <label for="points">Points</label>
                                                    <input type="number" name="points" class="form-control" value="{{ $coupon['points'] }}" required>
                                                </div>
                                                <div class="form-group">
                                                    <label for="status">Status</label>
                                                    <select name="status" class="form-control" required>
                                                        <option value="active" {{ $coupon['status'] == 'active' ? 'selected' : '' }}>Active</option>
                                                        <option value="inactive" {{ $coupon['status'] == 'inactive' ? 'selected' : '' }}>Inactive</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="valid_from">Valid From</label>
                                                    <input type="datetime-local" name="valid_from" class="form-control" value="{{ date('Y-m-d\TH:i', strtotime($coupon['valid_from'])) }}" required>
                                                </div>
                                                <div class="form-group">
                                                    <label for="valid_to">Valid To</label>
                                                    <input type="datetime-local" name="valid_to" class="form-control" value="{{ date('Y-m-d\TH:i', strtotime($coupon['valid_to'])) }}" required>
                                                </div>
                                                <div class="form-group">
                                                    <label for="description">Description</label>
                                                    <input type="text" name="description" class="form-control" value="{{ $coupon['description'] }}" required>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button type="submit" class="btn btn-primary">Save changes</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
<?php
/**
 * Creates a JSON page based on the parameters
 *
 * @author YOUR NAME
 *
 */
class JSONpage {
    private $page;
    private $recordset;

    /**
     * @param $pathArr - an array containing the route information
     */
    public function __construct($pathArr, $recordset) {
        $this->recordset = $recordset;
        //$path = (empty($pathArr[1])) ? "api" : $pathArr[1];
        $path = (empty($pathArr[2])) ? "api" : $pathArr[2];
        switch ($path) {
            case 'api':
                $this->page = $this->json_welcome();
                break;
            case 'update':
                $this->page = $this->json_update();
                break;
            case 'authors':
                $this->page = $this->json_authors();
                break;
            case 'content_authors':
                $this->page = $this->json_content_authors();
                break;
            case 'schedule':
                $this->page = $this->json_schedule();
                break;
            case 'schedule_detail':
                $this->page = $this->json_schedule_detail();
                break;
            case 'sessions': 
                $this->page = $this->json_sessions();
                break;
            case 'login':
                $this->page = $this->json_login();
                break;
            default:
                $this->page = $this->json_error();
                break;
        }
    }

//an arbitrary max length of 20 is set
    private function sanitiseString($x) {
        return substr(trim(filter_var($x, FILTER_SANITIZE_STRING)), 0, 20);
    }

//an arbitrary max range of 1000 is set
    private function sanitiseNum($x) {
        return filter_var($x, FILTER_VALIDATE_INT, array("options"=>array("min_range"=>0, "max_range"=>100000)));
    }

    private function json_welcome() {
        $data = array();
        $data['welcome'] = array('message' => 'Welcome!', "author" => "Mohammad Gerashi");
        $data['endpoint_1'] = array('api' => 'api/login', "details" => "To authenticate user with email and password");
        $data['endpoint_2'] = array('api' => 'api/authors', "details" => "To get list of authors");
        $data['endpoint_3'] = array('api' => 'api/authors?search=', "details" => "To search list of authors according to the search parameter");
        $data['endpoint_4'] = array('api' => 'api/sessions', "details" => "To get list of sessions");
        $data['endpoint_5'] = array('api' => 'api/sessions?sessionId=&name=', "details" => "To update session name according to the sessionId and get the updated sessions");
        $data['endpoint_6'] = array('api' => 'api/content_authors?authorId=', "details" => "To get the information of content and its author according to the authorId paramteter");
        $data['endpoint_7'] = array('api' => 'api/schedule?day=', "details" => "To get time slots according to the day paramteter");
        $data['endpoint_8'] = array('api' => 'api/schedule_detail?slotId=', "details" => "To get schedule information according to the slotId");
        return json_encode($data);
    }

    private function json_error() {
        $msg = array("message"=>"error");
        return json_encode($msg);
    }

    private function json_limitPage($query){
        $query .= " ORDER BY last_name";
        $query .= " LIMIT 10 ";
        $query .= " OFFSET ";
        $query .= 10 * ($this->sanitiseNum($_REQUEST['page'])-1);
        return $query;
    }

    /*
        function to validate if email and password 
        @param 
        @return {status: 200, message: "", token: "", user: {}} 
    */
    private function json_login() {
        $msg = "Invalid request. Username and password required";
        $status = 400;
        $token = null;
        $input = json_decode(file_get_contents("php://input"));
        if ($input) {

            if (isset($input->email) && isset($input->password)) {
                $query  = "SELECT username, admin, password, email FROM users WHERE email LIKE :email";
                $params = ["email" => $input->email];
                $res = json_decode($this->recordset->getJSONRecordSet($query, $params),true);
                $password = ($res['count']) ? $res['data'][0]['password'] : null;
                $user = ($res['count']) ? $res['data'][0] : null;
                if (password_verify($input->password, $password)) {
                    $msg = "User authorised. Welcome ". $res['data'][0]['username'];
                    $status = 200;
                    $token = array();
                    $token['email'] = $input->email;
                    $token['username'] = $res['data'][0]['username'];
                    $token['iat'] = time();
                    $token['exp'] = time() +(60*5);

                    $token = \Firebase\JWT\JWT::encode($token, 'secret_server_key');


                } else {
                    $msg = "username or password are invalid";
                    $status = 401;
                }
            }
        }

        return json_encode(array("status" => $status, "message" => $msg, "token" => $token, "user" => $user));
    }


    public function get_page() {
        return $this->page;
    }

    /*
        function to get authors 
        @param search
        @return {data: [], count: 0} 
    */
    public function json_authors() {
        $query  = "SELECT authorId, name FROM authors";
        $params = [];

        if (isset($_REQUEST['search'])) {
            $query .= " WHERE name LIKE :term";
            $term = $this->sanitiseString("%".$_REQUEST['search']."%");
            $params = ["term" => $term];
        } else {
            if (isset($_REQUEST['authorId'])) {
                $query .= " WHERE authorId = :term";
                $term = $this->sanitiseNum($_REQUEST['authorId']);
                $params = ["term" => $term];
            }
        }
        if (isset($_REQUEST['page'])) {
            $query .= " ORDER BY last_name";
            $query .= " LIMIT 10 ";
            $query .= " OFFSET ";
            $query .= 10 * ($this->sanitiseNum($_REQUEST['page'])-1);
            return $query;
        }

        return ($this->recordset->getJSONRecordSet($query, $params));
    }

    /*
        function to get content and its author data accourding to the authorId in the paramQuery. 
        @param authorId
        @return {data: [], count: 0} 
    */

    public function json_content_authors() {
        $query  = "SELECT authorId, authorInst, content_authors.contentId, content.title FROM content_authors JOIN content on (content_authors.contentId = content.contentId)";
        $params = [];
        if(isset($_REQUEST['authorId'])) {
            $query .= " WHERE authorId = :term";
            $term = $this->sanitiseNum($_REQUEST['authorId']);
            $params = ["term" => $term];
        }
        return ($this->recordset->getJSONRecordSet($query, $params));
    }
    /*
        function to get all time slots accourding to the day in the paramQuery. 
        @param day (Monday ~ Sunday)
        @return {data: [], count: 0} 
    */
    public function json_schedule() {
        $query = "SELECT * from slots";

        if(isset($_REQUEST['day'])) {
            $query .= " WHERE dayString = :term";
            $term = $this->sanitiseString($_REQUEST['day']);
            $params = ["term" => $term];
        }
        return ($this->recordset->getJSONRecordSet($query, $params));
    }
    /*
        function to get session, room, content info and author name based on the slotId in param. (JWT token required)
        @param slotId
        @return {data: [], count: 0} 
    */
    public function json_schedule_detail() {
        $query = "SELECT sessions.*, rooms.name as room_name, session_types.name as session_type, content.*, authors.name as author_name  from sessions JOIN rooms on (rooms.roomId=sessions.roomId) JOIN session_types on (session_types.typeId=sessions.typeId) JOIN sessions_content on (sessions_content.sessionId=sessions.sessionId) JOIN content on (content.contentId=sessions_content.contentId) JOIN content_authors on (content_authors.contentId=content.contentId) JOIN authors on (authors.authorId=content_authors.authorId)";
        if(isset($_REQUEST['slotId'])) {
            $query .= " WHERE sessions.slotId=:term";
            $term = $this->sanitiseNum($_REQUEST['slotId']);
            $params = ["term" => $term];
        }
        return ($this->recordset->getJSONRecordSet($query, $params));
    }

    /*
        function to get all sessions. (JWT token required)
        @param sessionId and name (if params is existing, to update the name based on the sessionId )
        @return {data: [], count: 0} 
    */
    public function json_sessions() {
        $input = json_decode(file_get_contents("php://input"));
        try {
            $jwtkey = 'secret_server_key';
            $tokenDecoded = \Firebase\JWT\JWT::decode($input->token, $jwtkey, array('HS256'));
        }
        catch (UnexpectedValueException $e) {
            return json_encode(array("status" => 401, "message" => $e->getMessage()));
        }
        if(isset($_REQUEST['sessionId']) && isset($_REQUEST['name'])) {
            $query = "UPDATE sessions SET name=:name WHERE sessionId=:sessionId";
            $sessionId = $this->sanitiseNum($_REQUEST['sessionId']);
            $name = $this->sanitiseString($_REQUEST['name']);
            $params = ["name"=>$name, "sessionId"=>$sessionId];
            $this->recordset->getJSONRecordSet($query, $params);
        }
        $query = "SELECT sessions.* FROM sessions";
        $params = [];
        return ($this->recordset->getJSONRecordSet($query, $params));
    }
}
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
            case 'actors':
                $this->page = $this->json_actors();
                break;
            case 'films':
                $this->page = $this->json_films();
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
        $msg = array("message"=>"welcome", "author"=>"Mohammad Gerashi");
        return json_encode($msg);
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

    /**
     * json_actors
     *
     * @todo this function can be improved
     */
    private function json_actors() {
        $query  = "SELECT first_name, last_name FROM actor";
        $params = [];

        if (isset($_REQUEST['search'])) {
            $query .= " WHERE last_name LIKE :term";
            $term = $this->sanitiseString("%".$_REQUEST['search']."%");
            $params = ["term" => $term];
        } else {
            if (isset($_REQUEST['id'])) {
                $query .= " WHERE actor_id = :term";
                $term = $this->sanitiseNum($_REQUEST['id']);
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

    /**
     * json_films
     *
     * @todo this function can be improved
     */
    private function json_films() {
        $query  = "SELECT film.film_id, film.title, film.description, film.rating, language.name AS language, film.length, category.name AS category FROM film JOIN language on (language.language_id = film.language_id) JOIN category on (category.category_id = film.category_id) ";
        $params = [];
        $where = " WHERE ";
        $doneWhere = FALSE;

        if (isset($_REQUEST['actor_id'])) {
            $query .= " INNER JOIN film_actor on 
                (film.film_id = film_actor.film_id)
                INNER JOIN actor on 
                (film_actor.actor_id = actor.actor_id) ";

            $where .= " actor.actor_id = :actor_id ";
            $doneWhere = TRUE;
            $term = $this->sanitiseNum($_REQUEST['actor_id']);
            $params["actor_id"] = $term;
        }

        if (isset($_REQUEST['search'])) {
            $doneWhere ? $where .= " AND " : $doneWhere = TRUE;

            $where .= " title LIKE :search";
            $term = $this->sanitiseString("%".$_REQUEST['search']."%");
            $params["search"] = $term;
        }
        if (isset($_REQUEST['id'])) {
            $doneWhere ? $where .= " AND " : $doneWhere = TRUE;

            $where .= " film_id = :film_id ";
            $term = $this->sanitiseNum($_REQUEST['id']);
            $params["film_id"] = $term;
        }

        $query .= $doneWhere ? $where : "";

        $nextpage = null;

        // @todo - this assumes a page should contain 10 items, but this is not consistent with the client
        if (isset($_REQUEST['page'])) {
            $query .= " ORDER BY film_id";
            $query .= " LIMIT 10 ";
            $query .= " OFFSET ";
            $query .= 10 * ($this->sanitiseNum($_REQUEST['page'])-1);
            $nextpage = BASEPATH."api/films?page=".$this->sanitiseNum($_REQUEST['page']+1);
        }

        // This decodes the JSON encoded by getJSONRecordSet() from an associative array
        // @todo - A recordset method that returns an associative array might be more appropriate
        $res = json_decode($this->recordset->getJSONRecordSet($query, $params),true);

        $res['status'] = 200;
        $res['message'] = "ok";
        $res['next_page'] = $nextpage;
        return json_encode($res);
    }

    /**
     * json_login
     *
     * @todo this method can be improved
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

    /**
     * json_update
     *
     * @todo this method can be improved
     */
    private function json_update() {
        $input = json_decode(file_get_contents("php://input"));

        if (!$input) {
            return json_encode(array("status" => 400, "message" => "Invalid request"));
        }
        if (!isset($input->token)) {
            return json_encode(array("status" => 401, "message" => "Not authorised"));
        }
        if (!isset($input->description) || !isset($input->film_id)) {
            return json_encode(array("status" => 400, "message" => "Invalid request"));
        }

        try {
            $jwtkey = JWTKEY;
            $tokenDecoded = \Firebase\JWT\JWT::decode($input->token, $jwtkey, array('HS256'));
        }
        catch (UnexpectedValueException $e) {
            return json_encode(array("status" => 401, "message" => $e->getMessage()));
        }

        $query  = "UPDATE film SET description = :description WHERE film_id = :film_id";
        $params = ["description" => $input->description, "film_id" => $input->film_id];
        $res = $this->recordset->getJSONRecordSet($query, $params);
        return json_encode(array("status" => 200, "message" => "ok", "result" => $res, "film_id" => $input->film_id,
            "Description"=>$input->description));
    }




    public function get_page() {
        return $this->page;
    }

    public function json_authors() {
        $input = json_decode(file_get_contents("php://input"));
        try {
            $jwtkey = 'secret_server_key';
            $tokenDecoded = \Firebase\JWT\JWT::decode($input->token, $jwtkey, array('HS256'));
        }
        catch (UnexpectedValueException $e) {
            return json_encode(array("status" => 401, "message" => $e->getMessage()));
        }
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
    public function json_schedule() {
        $query = "SELECT * from slots";

        if(isset($_REQUEST['day'])) {
            $query .= " WHERE dayString = :term";
            $term = $this->sanitiseString($_REQUEST['day']);
            $params = ["term" => $term];
        }
        return ($this->recordset->getJSONRecordSet($query, $params));
    }
    public function json_schedule_detail() {
        $query = "SELECT sessions.*, rooms.name as room_name, session_types.name as session_type, content.*, authors.name as author_name  from sessions JOIN rooms on (rooms.roomId=sessions.roomId) JOIN session_types on (session_types.typeId=sessions.typeId) JOIN sessions_content on (sessions_content.sessionId=sessions.sessionId) JOIN content on (content.contentId=sessions_content.contentId) JOIN content_authors on (content_authors.contentId=content.contentId) JOIN authors on (authors.authorId=content_authors.authorId)";
        if(isset($_REQUEST['slotId'])) {
            $query .= " WHERE sessions.slotId=:term";
            $term = $this->sanitiseNum($_REQUEST['slotId']);
            $params = ["term" => $term];
        }
        return ($this->recordset->getJSONRecordSet($query, $params));
    }
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